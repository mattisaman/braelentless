import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import TopNav from '@/components/TopNav'
import { ThemeProvider } from '@/components/ThemeProvider'
import SyncProvider from '@/components/SyncProvider'

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
          <SyncProvider>
            <TopNav />
            <main className="app-main">{children}</main>
            <BottomNav />
          </SyncProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
