import { Geist, Inter, Space_Grotesk } from "next/font/google";

// Inter font with weights 600 and 700 for UI elements
export const fontInter = Inter({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Base font for body text (supports all weights)
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Space Grotesk heading font (geometric sans-serif, similar to CalSans)
export const fontHeading = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"], // SemiBold and Bold
  variable: "--font-heading",
  display: "swap",
});

// Geist variable font from Google Fonts
export const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
