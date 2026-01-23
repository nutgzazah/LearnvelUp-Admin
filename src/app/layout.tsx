import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const k2d = localFont({
  src: [
    {
      path: "../../assets/fonts/K2D-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/K2D-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/K2D-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../assets/fonts/K2D-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../assets/fonts/K2D-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../assets/fonts/K2D-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-k2d",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnvelUp Admin",
  description: "Admin Dashboard for LearnvelUp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${k2d.variable} font-sans antialiased bg-background text-text`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
