export const ease = [0.16, 1, 0.3, 1] as const;
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  panel: 0.35,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const staggerContainer = (stagger = 0.06, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const springSnappy = { type: "spring" as const, stiffness: 420, damping: 34 };
export const springSoft = { type: "spring" as const, stiffness: 260, damping: 28 };
