import { Nunito } from 'next/font/google'
import localFont from 'next/font/local'

export const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const sigmaOne = localFont({
  src: '../../public/fonts/SigmaOne-Regular.woff2',
  variable: '--font-sigma',
  display: 'swap',
})
