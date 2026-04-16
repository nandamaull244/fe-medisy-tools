"use client";

import { usePathname } from "next/navigation";
import { Icons } from "@/icons";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    {
      name: "Faskes",
      href: "/",
      icon: <Icons.faskes size={20} />,
    },
    {
      name: "Create Faskes",
      href: "/faskes/create",
      icon: <Icons.add size={20} />,
    },
    {
      name: "Compare",
      href: "/compare",
      icon: <Icons.compare size={20} />,
    },
    {
      name: "Migration",
      href: "/migration",
      icon: <Icons.migration size={20} />,
    },
  ];

  return (
    <div className="w-64 bg-white rounded-xl shadow-sm p-4">
      <nav className="space-y-2">
        {menu.map((item) => {
          const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className={`p-2 rounded-xl flex items-center gap-2 transition
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-primary hover:text-white"
                }
              `}
            >
              {item.icon}
              {item.name}
            </a>
          );
        })}
      </nav>
    </div>
  );
}