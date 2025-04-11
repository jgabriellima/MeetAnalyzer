"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Settings2, 
  Link as LinkIcon,
  Zap
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start w-full"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarNavItems = [
    {
      title: "Perfil",
      href: "/app/settings/account",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      title: "Segurança",
      href: "/app/settings/security",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
    {
      title: "Notificações",
      href: "/app/settings/notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
    },
    {
      title: "Assinatura",
      href: "/app/settings/billing",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Integrações",
      href: "/app/settings/integrations",
      icon: <LinkIcon className="mr-2 h-4 w-4" />,
    },
    {
      title: "API",
      href: "/app/settings/api",
      icon: <Zap className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <div className="h-full bg-background pl-4">
      <div className="border-b">
        <div className="container flex h-16 items-center max-w-7xl">
          <h1 className="text-lg font-semibold">Configurações</h1>
        </div>
      </div>
      <div className="container max-w-7xl">
        <div className="grid lg:grid-cols-5 gap-8 pt-8 pb-16">
          <aside className="lg:col-span-1 border-r pr-4 hidden lg:block">
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-semibold">Preferências</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Gerencie suas configurações
                </p>
                <Separator className="my-4" />
                <SidebarNav items={sidebarNavItems} />
              </div>
            </div>
          </aside>
          <div className="lg:col-span-4 lg:border-l lg:pl-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 