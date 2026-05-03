import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Icons } from "../icons";

export const metadata: Metadata = {
  title: "Medisy Tools",
  description: "Dashboard Medisy Tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/icon_fav.png" />
      </head>
      <body className="h-full px-4 bg-background">
        <Header />

        <div className="flex h-full">
          {/* Content */}
          {/* Sidebar */}
          <Sidebar />

          <main className="w-full h-full  ml-3 ">{children}</main>
        </div>
      </body>
    </html>
  );
}
