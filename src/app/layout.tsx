import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import TopNav from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'Braelentless — Braelyn Keshequa',
  description: 'Athlete performance platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ background: '#0a0706', minHeight: '100%' }}>
      <body style={{ background: '#0a0706', margin: 0, padding: 0, minHeight: '100%' }}>
        <TopNav />
        <main style={{ paddingBottom: '64px' }}>{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
