import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "T Shop Online Store | Retail Fixtures & 3D Store Layouts",
  description:
    "Retail fixtures built to fit your store. Heavy-duty modular shelving, commercial refrigeration, POS counters, and 3D store preview layouts.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
