export interface OnboardingItemType {
  id: number;
  title: string;
  description: string;
  image?: unknown;
  buttonText?: string;
}

/** Order matches design: three intro slides, then auth / welcome slide. */
export const onboardingData: OnboardingItemType[] = [
  {
    id: 1,
    title: 'Stay on top of your spending',
    description:
      'Track your daily expenses effortlessly and build better financial habits over time.',
    buttonText: 'Tap to continue',
  },
  {
    id: 2,
    title: 'Know where your money goes',
    description:
      'See clear breakdowns of your spending by category with simple, visual analytics.',
    buttonText: 'Tap to continue',
  },
  {
    id: 3,
    title: 'Make smarter decisions',
    description:
      'Set budgets, track progress, and get gentle nudges to help you save more each month.',
    buttonText: 'Get Started',
  },
  {
    id: 4,
    title: 'Start your financial journey',
    description:
      'Track expenses, manage your budget, and stay organized every day.',
    buttonText: 'Get Started',
  },
];

export const ONBOARDING_INTRO_STEPS = 3;
