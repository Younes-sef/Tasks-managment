import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./(main)/dashboard/__components/theme-provider";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { ClerkProvider } from '@clerk/nextjs'

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "TaskFlow | Modern Task Management",
  description: "A beautiful, premium task management application with real-time collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              {children}
            </Providers>
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
