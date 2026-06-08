import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const here = path.dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: here,
    },
  },
};

export default config;