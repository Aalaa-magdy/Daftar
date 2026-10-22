const fs = require("fs");
const path = require("path");

const ROOTS = ["app", "components", "features"];
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const RN_IMPORT = /import\s*\{([^}]*)\}\s*from\s*["']react-native["'];?/;

for (const root of ROOTS.filter(fs.existsSync)) {
  for (const file of walk(root)) {
    if (!file.endsWith(".tsx") || file.replace(/\\/g, "/").endsWith("ui/AppText.tsx")) continue;
    let src = fs.readFileSync(file, "utf8");
    const m = src.match(RN_IMPORT);
    if (!m) continue;
    const specs = m[1].split(",").map((s) => s.trim()).filter(Boolean);
    const moved = specs.filter((s) => s === "Text" || s === "TextInput");
    if (!moved.length) continue;
    const kept = specs.filter((s) => !moved.includes(s));
    const rnImport = kept.length
      ? `import {\n  ${kept.join(",\n  ")},\n} from "react-native";`
      : "";
    const appImport = `import { ${moved.join(", ")} } from "@/components/ui/AppText";`;
    src = src.replace(RN_IMPORT, [rnImport, appImport].filter(Boolean).join("\n"));
    fs.writeFileSync(file, src);
    console.log("updated", file);
  }
}