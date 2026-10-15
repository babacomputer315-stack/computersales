import type { Config } from "tailwindcss";

const config: Config = {
  // Resolve content globs relative to this config file, not the build process's
  // current working directory. This prevents Tailwind utilities disappearing
  // when the deployment runner starts from a different directory.
  content: {
    relative: true,
    files: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  },

  theme: {
    extend: {
      fontFamily: {
        estedad: ["Estedad", "sans-serif"],
        noora: ["Noora", "sans-serif"],
        peyda: ["Peyda", "sans-serif"],
        peydaEn: ["PeydaEn", "sans-serif"],
        sans: ["Peyda", "sans-serif"],
      },

      borderWidth: {
        "1.5": "1.5px",
      },

      colors: {
        // Primary Palette
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)",
        "primary-50": "var(--primary-50)",
        "primary-100": "var(--primary-100)",
        "primary-200": "var(--primary-200)",
        "primary-300": "var(--primary-300)",
        "primary-400": "var(--primary-400)",
        "primary-500": "var(--primary-500)",
        "primary-600": "var(--primary-600)",
        "primary-700": "var(--primary-700)",
        "primary-800": "var(--primary-800)",
        "primary-900": "var(--primary-900)",

        secondary: "var(--secondary)",
        "secondary-900": "var(--secondary-900)",

        // Transparencies
        "primary-500-08": "var(--primary-500-08)",
        "primary-500-06": "var(--primary-500-06)",
        "primary-500-20": "var(--primary-500-20)",
        "primary-05": "var(--primary-05)",

        // Alerts
        success: "var(--success)",
        "success-light": "var(--success-light)",
        "success-05": "var(--success-05)",
        warning: "var(--warning)",
        "warning-light": "var(--warning-light)",
        danger: "var(--danger)",
        "danger-light": "var(--danger-light)",
        info: "var(--info)",
        "info-light": "var(--info-light)",

        // UI
        dark: "var(--dark)",
        light: "var(--light)",
        "dark-blue": "var(--dark-blue)",
        icon: "var(--icon)",
        stroke: "var(--stroke)",
        neutral: "var(--neutral)",
        "main-background": "var(--main-background)",
        gray: "var(--gray)",
        "gray-800": "var(--gray-800)",

        // Text
        "main-text": "var(--main-text)",
        "secondary-text": "var(--secondary-text)",

        // White Variants
        "white-05": "var(--white-05)",
        "white-08": "var(--white-08)",
        "white-10": "var(--white-10)",
        "white-70": "var(--white-70)",
        "white-50": "var(--white-50)",
        "white-25": "var(--white-25)",
        "white-20": "var(--white-20)",

        // Input
        "input-bg": "var(--input-bg)",
      },
    },
  },
};

export default config;
