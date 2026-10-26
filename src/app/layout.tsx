import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Let It Map — Discover the World Through the Beatles' Eyes",
  description:
    "Pin legendary spots on the map, share your stories, and explore a world of Beatles fan experiences.",
};

// viewportFit: "cover" lets the layout extend under the iOS home indicator,
// which is what --safe-bottom then pads back.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Extensions such as Grammarly stamp attributes onto body before React
          hydrates. This ignores body's own attributes only — a mismatch inside
          the tree is still reported. */}
      <body
        suppressHydrationWarning
        className={`${plusJakarta.variable} ${dmSerif.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
