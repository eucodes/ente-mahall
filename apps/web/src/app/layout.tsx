import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ToastHost } from "@mahalle/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahalle",
  description: "Multi-tenant Mahalle management platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ToastHost>{children}</ToastHost>
      </body>
    </html>
  );
}
