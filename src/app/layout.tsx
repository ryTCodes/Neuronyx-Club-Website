import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import AmbientSpotlight from "@/components/website/AmbientSpotlight";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://neuronyx.aiktc.ac.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NeurOnyx | ACM Student Chapter | AIKTC New Panvel",
    template: "%s | NeurOnyx AIKTC",
  },
  description:
    "Official website of NeurOnyx, the ACM Student Chapter at Anjuman-I-Islam's Kalsekar Technical Campus (AIKTC), New Panvel. Empowering students in Artificial Intelligence (AI), Machine Learning (ML), and innovative tech through hackathons, workshops, and collaborative research.",
  keywords: [
    "NeurOnyx",
    "NeurOnyx AIKTC",
    "NeurOnyx Club",
    "ACM NeurOnyx",
    "ACM Student Chapter AIKTC",
    "AIKTC Panvel",
    "AIKTC",
    "Artificial Intelligence Club AIKTC",
    "Machine Learning Club Navi Mumbai",
    "CSE AI ML AIKTC",
    "Anjuman-I-Islam's Kalsekar Technical Campus",
    "Hacktoon",
    "The Clash of Context",
    "Student Tech Club Navi Mumbai",
    "AIKTC Incubation Centre",
  ],
  authors: [{ name: "NeurOnyx Club AIKTC", url: siteUrl }],
  creator: "NeurOnyx ACM Student Chapter",
  publisher: "Anjuman-I-Islam's Kalsekar Technical Campus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "NeurOnyx AIKTC",
    title: "NeurOnyx | ACM Student Chapter | AIKTC New Panvel",
    description:
      "Empowering students to lead the future of AI & Machine Learning. Official ACM Student Chapter at Anjuman-I-Islam's Kalsekar Technical Campus, New Panvel.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "NeurOnyx ACM Student Chapter AIKTC Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeurOnyx | ACM Student Chapter | AIKTC New Panvel",
    description:
      "Empowering students to lead the future of AI & Machine Learning at AIKTC New Panvel.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body className="bg-[#05070D] text-slate-50 antialiased">
        <SmoothScroll />
        <AmbientSpotlight />
        <div className="min-h-screen bg-[#05070D]">
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

