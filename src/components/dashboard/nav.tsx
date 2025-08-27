"use client";

import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Camera,
  BookText,
  BarChart2,
  BookOpenCheck,
} from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/attendance", label: "Take Attendance", icon: Camera },
  { href: "/dashboard/logs", label: "Attendance Logs", icon: BookText },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart2 },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === link.href}
              tooltip={{ children: link.label, side: "right", align: "center" }}
            >
              <link.icon />
              <span>{link.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function SidebarHeaderContent() {
  return (
    <div className="flex items-center gap-2 p-2">
       <BookOpenCheck className="w-8 h-8 text-primary" />
       <span className="font-headline font-bold text-lg group-data-[collapsible=icon]:hidden">
        VidyaAttend
       </span>
    </div>
  )
}
