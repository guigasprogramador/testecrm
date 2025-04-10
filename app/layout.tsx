import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SideNav } from "@/components/side-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { MobileMenuToggle } from "@/components/mobile-menu-toggle"
import { AuthProvider } from "@/hooks/useAuth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CRM Licitações - OneFlow",
  description: "Sistema de gestão de licitações e documentação",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#F5F5F5]`}>
        <ThemeProvider defaultTheme="light" storageKey="crm-theme">
          <AuthProvider>
            <div className="flex min-h-screen">
              <SideNav />
              <div className="flex-1 flex flex-col w-full">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
                  <div className="flex flex-1 items-center justify-between md:justify-end gap-4">
                    <div className="md:hidden">
                      <MobileMenuToggle />
                    </div>
                    <div className="flex items-center gap-4">
                      <Link href="/notificacoes">
                        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                          <Bell className="h-5 w-5" />
                          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                            3
                          </span>
                        </Button>
                      </Link>
                      <UserNav />
                    </div>
                  </div>
                </header>
                <main className="flex-1">{children}</main>
              </div>
              <MobileNav />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}