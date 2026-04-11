import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#020617]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}