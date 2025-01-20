import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes'

const inter = Inter({ subsets: ["latin"] });


// Title and desc of app
export const metadata = {
  title: "ActionArc",
  description: "A project management tool to streamline workflows and boost productivity.",
};

export default function RootLayout({ children }) {
  return (
    // Clerk forms appearance base theme set to dark , changes in appearance for signin/up pages can be done from here
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables:{
          
        },
      }}
    >

      <html lang="en">
        <head>
          <meta name="description" content={metadata.description} />
        </head>
        <body className={`${inter.className}`}>

        {/* Nextjs page theme set to dark, imported from theme-provider */}
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <footer className="bg-gray-900 py-10">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made By Zeeshan Khan </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
