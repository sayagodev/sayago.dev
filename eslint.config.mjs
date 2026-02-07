import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow setState in useEffect for client/server hydration patterns
      "react-hooks/set-state-in-effect": "off",
      // Allow component creation in useMemo when using motion.create (false positive)
      "react-hooks/static-components": "warn",
    },
  },
  {
    files: ["**/text-rotate.tsx"],
    rules: {
      // Disable for text-rotate.tsx where motion.create is used safely with useMemo
      "react-hooks/static-components": "off",
    },
  },
])

export default eslintConfig
