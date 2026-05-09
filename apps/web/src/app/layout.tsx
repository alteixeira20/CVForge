import type { Metadata } from 'next'
import { Lexend, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeContext'
import { CVProvider } from '@/context/CVContext'
import './globals.css'

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CVForge - Local-first CV Builder',
  description:
    'Build, back up, export, and inspect a CV locally in the browser without an account.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${lexend.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeProvider>
          <CVProvider>{children}</CVProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
