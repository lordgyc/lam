import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'La Menu',
  description: 'Beautiful mobile-first menu interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

