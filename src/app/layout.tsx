import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import TopNav from '@/components/TopNav'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Braelentless — Braelyn Keshequa',
  description: 'Athlete performance platform',
  icons: {
    icon: '/wildcats-logo.jpeg',
    apple: '/wildcats-logo.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, minHeight: '100%' }}>
        <ThemeProvider>
          <TopNav />
          <main style={{ paddingBottom: '64px' }}>{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
