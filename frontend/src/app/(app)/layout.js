import { Inter, Poppins, Montserrat } from "next/font/google";
import ClientOnly from "@/components/ClientOnly";
import Navbar from "@/components/(app)/navbar/Navbar";
import Footer from "@/components/(app)/Footer";

export const metadata = {
  title: {
    default: "Travana - Voyager en Tunisie",
    template: "%s | Naseam",
  },
  description:
    "Votre portail pour explorer la Tunisie. Réservez hôtels, circuits et plus avec Naseam.",
  robots: "index, follow",
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

// Primary font for body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display font for headings
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

// Accent font for prices
const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const AppLayout = ({ children }) => {
  return (
    <div
      className={`${inter.variable} ${poppins.variable} ${montserrat.variable} font-[family-name:var(--font-inter)] antialiased`}
    >
      <ClientOnly>
        <Navbar />
        <main className="py-16 min-h-screen">{children}</main>
        <Footer />
      </ClientOnly>
    </div>
  );
};

export default AppLayout;
