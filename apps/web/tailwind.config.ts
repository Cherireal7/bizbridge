import type { Config } from 'tailwindcss'
import preset from '@bizbridge/config/tailwind'
import typography from '@tailwindcss/typography'

const config: Config = {
  presets: [preset],
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/payload/**/*.{ts,tsx,mdx}',
  ],
  plugins: [typography],
}

export default config
