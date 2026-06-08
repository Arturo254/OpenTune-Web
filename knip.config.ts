import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: [
    'src/**/*.{ts,tsx}',
    'src/**/*.{test,spec}.{ts,tsx}'
  ],

  entry: [
    'src/app/**/*.{ts,tsx}',
    'src/*.{ts,tsx}'
  ],
  
  ignore: [
    'src/app/~test/locale/**/*.{ts,tsx}',
    'src/app/~test/locale/*.{ts,tsx}'
  ],
  
  ignoreDependencies: [
    'tailwindcss',
  ],

  // Uncomment for production mode analysis (excludes tests/dev)
  // productionEntry: ['src/app/**/*.{ts,tsx}!'],
  // productionProject: ['src/**/*.{ts,tsx}!', '!src/**/*.{test,spec,stories}.{ts,tsx}'],
};

export default config;
