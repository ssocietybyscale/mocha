import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mocha Mono Vol.2",
  description: "Moch Mono Colume 2 Event Form",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
