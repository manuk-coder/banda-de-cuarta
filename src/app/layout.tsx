import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BandaDeCuarta",
  description:
    "Cuarteto argentino, canciones mundialeras y fiesta celeste y blanca.",
  applicationName: "BandaDeCuarta",
  authors: [{ name: "BandaDeCuarta" }],
  openGraph: {
    title: "BandaDeCuarta",
    description:
      "Cuarteto argentino, canciones mundialeras y fiesta celeste y blanca.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
