/**
 * Generates the native splash / launcher assets from the master logo.
 *
 * The master (assets/images/New_logo.png) is a 2048x2048 fully-opaque image:
 * a 1000x1000 logo centred in a solid #F7FAF8 field. That baked-in field is
 * why the splash showed a visible off-white box, and the 51% of dead padding
 * is why the logo looked small — Expo scales the *whole file* to `imageWidth`.
 *
 * The logo is a knockout design: the chart bars, the page and the pocket are
 * the SAME colour as the background. So the background cannot be removed with
 * a colour key, that would punch holes straight through the artwork. We flood
 * fill inward from the border instead, which only reaches the outer field.
 *
 * Run: node scripts/make-brand-assets.js
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets/images/New_logo.png');
const OUT_DIR = path.join(ROOT, 'assets/images');

/** Max per-channel delta still counted as "the background field". */
const FLOOD_TOLERANCE = 20;
/** Distance from the background colour at which a pixel is fully opaque. */
const ALPHA_RAMP = 150;
/** How far the anti-aliased edge band may extend inward, in px. */
const BAND = 4;

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/** Flood fill from every border pixel, 4-connected, tolerance-matched to bg. */
function findOuterField(png, bg) {
  const { width: w, height: h, data } = png;
  const reachable = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const matches = (p) => {
    const i = p * 4;
    return (
      Math.abs(data[i] - bg[0]) <= FLOOD_TOLERANCE &&
      Math.abs(data[i + 1] - bg[1]) <= FLOOD_TOLERANCE &&
      Math.abs(data[i + 2] - bg[2]) <= FLOOD_TOLERANCE
    );
  };
  const push = (p) => {
    if (!reachable[p] && matches(p)) {
      reachable[p] = 1;
      queue[tail++] = p;
    }
  };

  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }

  while (head < tail) {
    const p = queue[head++];
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (y > 0) push(p - w);
    if (y < h - 1) push(p + w);
  }
  return reachable;
}

/** Grow `mask` outward by `radius` px, returning a new mask. */
function dilate(mask, w, h, radius) {
  let cur = mask;
  for (let step = 0; step < radius; step++) {
    const next = new Uint8Array(cur);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        if (cur[p]) continue;
        if (
          (x > 0 && cur[p - 1]) ||
          (x < w - 1 && cur[p + 1]) ||
          (y > 0 && cur[p - w]) ||
          (y < h - 1 && cur[p + w])
        ) {
          next[p] = 1;
        }
      }
    }
    cur = next;
  }
  return cur;
}

/** Straight-alpha RGBA buffer with the outer field knocked out. */
function cutOutBackground(png, bg) {
  const { width: w, height: h, data } = png;
  const field = findOuterField(png, bg);
  const band = dilate(field, w, h, BAND);
  const out = Buffer.alloc(w * h * 4);

  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    if (field[p]) continue; // fully transparent

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Only the thin band hugging the outer field gets a graded alpha. Interior
    // knockouts sit far from the field and stay fully opaque — no holes.
    if (!band[p]) {
      out[i] = r;
      out[i + 1] = g;
      out[i + 2] = b;
      out[i + 3] = 255;
      continue;
    }

    const dist = Math.max(
      Math.abs(r - bg[0]),
      Math.abs(g - bg[1]),
      Math.abs(b - bg[2])
    );
    const a = clamp(dist / ALPHA_RAMP, 0, 1);
    if (a <= 0) continue;
    // Un-matte: recover the original colour from its blend against the field.
    out[i] = clamp(Math.round(bg[0] + (r - bg[0]) / a), 0, 255);
    out[i + 1] = clamp(Math.round(bg[1] + (g - bg[1]) / a), 0, 255);
    out[i + 2] = clamp(Math.round(bg[2] + (b - bg[2]) / a), 0, 255);
    out[i + 3] = Math.round(a * 255);
  }
  return out;
}

function contentBounds(rgba, w, h) {
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (rgba[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/**
 * Box-filter resample of a sub-rect into `contentPx`, composited centred on a
 * square canvas. Averaging happens in premultiplied alpha so semi-transparent
 * edges do not drag in a dark halo.
 */
function render(rgba, srcW, box, canvas, contentPx, background) {
  const out = new PNG({ width: canvas, height: canvas });
  if (background) {
    for (let p = 0; p < canvas * canvas; p++) {
      const o = p * 4;
      out.data[o] = background[0];
      out.data[o + 1] = background[1];
      out.data[o + 2] = background[2];
      out.data[o + 3] = 255;
    }
  }

  const scale = contentPx / Math.max(box.w, box.h);
  const dw = Math.round(box.w * scale);
  const dh = Math.round(box.h * scale);
  const offX = Math.round((canvas - dw) / 2);
  const offY = Math.round((canvas - dh) / 2);
  const step = 1 / scale;

  for (let y = 0; y < dh; y++) {
    for (let x = 0; x < dw; x++) {
      const sx0 = box.minX + x * step;
      const sy0 = box.minY + y * step;
      const sxEnd = Math.max(Math.ceil(sx0 + step), Math.floor(sx0) + 1);
      const syEnd = Math.max(Math.ceil(sy0 + step), Math.floor(sy0) + 1);
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let n = 0;
      for (let sy = Math.floor(sy0); sy < syEnd; sy++) {
        if (sy > box.maxY) break;
        for (let sx = Math.floor(sx0); sx < sxEnd; sx++) {
          if (sx > box.maxX) break;
          const i = (sy * srcW + sx) * 4;
          const sa = rgba[i + 3] / 255;
          r += rgba[i] * sa;
          g += rgba[i + 1] * sa;
          b += rgba[i + 2] * sa;
          a += sa;
          n++;
        }
      }
      if (!n) continue;
      const avgA = a / n;
      if (avgA <= 0) continue;
      const o = ((y + offY) * canvas + (x + offX)) * 4;
      // Un-premultiply, then composite over whatever the canvas already holds.
      const cr = r / n / avgA;
      const cg = g / n / avgA;
      const cb = b / n / avgA;
      const da = out.data[o + 3] / 255;
      const outA = avgA + da * (1 - avgA);
      out.data[o] = Math.round((cr * avgA + out.data[o] * da * (1 - avgA)) / outA);
      out.data[o + 1] = Math.round((cg * avgA + out.data[o + 1] * da * (1 - avgA)) / outA);
      out.data[o + 2] = Math.round((cb * avgA + out.data[o + 2] * da * (1 - avgA)) / outA);
      out.data[o + 3] = Math.round(outA * 255);
    }
  }
  return out;
}

const src = PNG.sync.read(fs.readFileSync(SRC));
const bg = [src.data[0], src.data[1], src.data[2]];
const hex = bg.map((c) => c.toString(16).padStart(2, '0')).join('');
console.log('source ' + src.width + 'x' + src.height + ', field #' + hex);

const cut = cutOutBackground(src, bg);
const box = contentBounds(cut, src.width, src.height);
console.log(
  'logo bounds ' + box.w + 'x' + box.h + ' at (' + box.minX + ',' + box.minY + ') — ' +
    ((100 * box.w) / src.width).toFixed(1) + '% of the master'
);

const targets = [
  // Tight crop, so `imageWidth` in app.json maps 1:1 to the visible logo.
  { file: 'splash-icon.png', canvas: 1024, fill: 0.96, background: null },
  // Adaptive icon foreground: Android masks to a circle and only the inner
  // ~66% is guaranteed visible, so the logo is inset to that safe zone.
  { file: 'adaptive-icon-foreground.png', canvas: 1024, fill: 0.66, background: null },
  // iOS / legacy launcher icon must be opaque — alpha renders as black there.
  { file: 'icon.png', canvas: 1024, fill: 0.8, background: bg },
  // In-app mark. Zero padding, so a style's width/height is the mark's real
  // size and it aligns flush with whatever container edge it sits against.
  { file: 'logo-mark.png', canvas: 512, fill: 1, background: null },
];

for (const t of targets) {
  const png = render(cut, src.width, box, t.canvas, Math.round(t.canvas * t.fill), t.background);
  fs.writeFileSync(path.join(OUT_DIR, t.file), PNG.sync.write(png));
  console.log(
    '  wrote ' + t.file + '  ' + t.canvas + 'x' + t.canvas +
      '  logo at ' + (t.fill * 100).toFixed(0) + '%  ' +
      (t.background ? 'opaque' : 'transparent')
  );
}
