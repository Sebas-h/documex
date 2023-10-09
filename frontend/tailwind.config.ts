import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: {
        DEFAULT: {
          css: {
            // Selects `<code>` block NOT preceded by `<pre>`, i.e. should
            // select only inline code blocks
            "code:not(pre > code)": {
              backgroundColor: "var(--tw-prose-pre-bg)",
              fontWeight: "400",
              padding: "0.2em 0.4em",
              fontSize: "85%",
              "border-radius": "0.25rem",
            },
            "code:not(pre > code)::before": {
              content: '""',
            },
            "code:not(pre > code)::after": {
              content: '""',
            },
            summary: {
              cursor: "default",
            },
            details: {
              border: "1px solid var(--tw-prose-body)",
              "border-radius": "0.5rem",
              "padding-left": ".5rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
