import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const pjs = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-pjs',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Personal OS',
  description: 'Your private life system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={pjs.variable}>
      <body>{children}</body>
    </html>
  )
}
