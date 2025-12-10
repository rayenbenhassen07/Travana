import { Inter, Poppins, Montserrat, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ClientOnly from "@/components/ClientOnly";
import { Toaster } from "sonner";

// Primary font for body text - highly readable
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display font for headings and hero text
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

// Accent font for prices and special elements
const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Monospace for codes and dates
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Naseam - Book Your Perfect Stay",
  description:
    "Discover and book amazing houses and excursions for your next adventure",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${montserrat.variable} ${robotoMono.variable} font-[family-name:var(--font-inter)] antialiased bg-neutral-50 text-neutral-900`}
      >
        <ClientOnly>
          <Toaster position="top-right" />
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
