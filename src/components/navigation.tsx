"use client";
import { SettingsIcon, UsersIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-2">
      {routes.map((route) => {
        const isActive = pathname === route.href;
        const Icon = isActive ? route.activeIcon : route.icon;
        return (
          <li key={route.href}>
            <Link href={route.href}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md transition-all duration-300 font-medium hover:text-primary text-neutral-500",
                  isActive &&
                    "text-primary bg-white shadow-sm hover:opacity-100"
                )}
              >
                <Icon className="size-5 text-neutral-500" />
                {route.label}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
