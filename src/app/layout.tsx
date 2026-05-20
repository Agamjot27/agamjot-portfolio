import type { Metadata } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agamjot Singh | Portfolio Search",
  description:
    "Search Agamjot Singh's ML research, projects, hackathon results, and resume — B.Tech IT @ MIT Manipal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} h-full`}
    >
      <body
        suppressHydrationWarning
        className={`${roboto.className} min-h-full flex flex-col antialiased`}
      >
        <Script id="portfolio-theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
