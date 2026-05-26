import '@knadh/oat/oat.min.css';
import './globals.css'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
