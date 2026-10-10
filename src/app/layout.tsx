import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CLINIC } from "@/lib/clinic";

const vazirmatn = localFont({
  src: [
    { path: "../fonts/Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Vazirmatn-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Vazirmatn-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Vazirmatn-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Vazirmatn-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-vazir",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mehrava-dental.ir";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${CLINIC.name} | رزرو آنلاین نوبت، ایمپلنت، ارتودنسی و زیبایی دندان در تهران`,
    template: `%s | ${CLINIC.name}`,
  },
  description:
    "کلینیک دندانپزشکی مهرآوا تهران با ۱۵ سال تجربه — ایمپلنت با گارانتی مادام‌العمر، ارتودنسی شفاف، طراحی لبخند و لمینت. رزرو آنلاین نوبت در ۲ دقیقه، پیامک یادآوری، پرداخت آنلاین هزینه ویزیت و مشاوره هوشمند ۲۴ ساعته.",
  keywords: [
    "دندانپزشکی تهران",
    "کلینیک دندانپزشکی",
    "مطب دندانپزشکی",
    "ایمپلنت دندان تهران",
    "ارتودنسی",
    "لمینت دندان",
    "طراحی لبخند",
    "بلیچینگ",
    "نوبت دندانپزشکی آنلاین",
    "دندانپزشک ونک",
    "عصب کشی",
    "دندانپزشکی کودکان",
  ],
  authors: [{ name: CLINIC.name }],
  creator: CLINIC.name,
  publisher: CLINIC.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: CLINIC.name,
    title: `${CLINIC.name} — لبخند شما، اعتبار ما`,
    description:
      "ایمپلنت، ارتودنسی، زیبایی و طراحی لبخند با تجهیزات دیجیتال نسل جدید. رزرو آنلاین نوبت + مشاوره هوشمند ۲۴ ساعته + پیامک یادآوری.",
    images: [{ url: "/images/og-clinic.png", width: 1440, height: 720, alt: CLINIC.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${CLINIC.name} — لبخند شما، اعتبار ما`,
    description: "رزرو آنلاین نوبت دندانپزشکی در تهران با مشاوره هوشمند ۲۴ ساعته",
    images: ["/images/og-clinic.png"],
  },
  icons: { icon: "/logo.svg?v=5", apple: "/logo.svg?v=5" },
};

export const viewport: Viewport = {
  themeColor: "#006241",
  width: "device-width",
  initialScale: 1,
};

// ─── داده ساختاریافته Schema.org — نوع Dentist (زیرمجموعه LocalBusiness) ──
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dentist",
      "@id": `${SITE_URL}/#clinic`,
      name: CLINIC.name,
      description:
        "کلینیک تخصصی دندانپزشکی در تهران با خدمات ایمپلنت، ارتودنسی، طراحی لبخند، عصب‌کشی و دندانپزشکی کودکان؛ رزرو آنلاین نوبت و مشاوره هوشمند ۲۴ ساعته.",
      url: SITE_URL,
      telephone: "+98-21-91008800",
      email: CLINIC.email,
      priceRange: "₹₹",
      currenciesAccepted: "IRR",
      paymentAccepted: "Cash, Credit Card, Online Payment",
      image: `${SITE_URL}/images/og-clinic.png`,
      logo: `${SITE_URL}/logo.svg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "خیابان ولیعصر، بالاتر از میدان ونک، برج پزشکان مهرآوا، طبقه ۵",
        addressLocality: "تهران",
        addressRegion: "تهران",
        addressCountry: "IR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: CLINIC.geo.lat,
        longitude: CLINIC.geo.lng,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
          opens: "09:00",
          closes: "21:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Thursday",
          opens: "09:00",
          closes: "18:00",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "612",
        bestRating: "5",
      },
      review: [
        {
          "@type": "Review",
          author: { "@type": "Person", name: "مریم حسینی" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody:
            "جراحی ایمپلنت کاملاً بدون درد بود و پیگیری بعد از درمان فوق‌العاده منظم. کلینیک مهرآوا را به همه پیشنهاد می‌کنم.",
          datePublished: "2024-10-05",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "علی محمدی" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "ارتودنسی شفاف با پیگیری پیامکی منظم و جلسات سر وقت؛ نتیجه عالی بود.",
          datePublished: "2024-09-02",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "خدمات دندانپزشکی",
        itemListElement: [
          "ایمپلنت دندان",
          "ارتودنسی تخصصی",
          "زیبایی و لمینت",
          "عصب‌کشی",
          "بلیچینگ",
          "دندانپزشکی کودکان",
        ].map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "MedicalProcedure", name: s },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: CLINIC.name,
      inLanguage: "fa-IR",
      publisher: { "@id": `${SITE_URL}/#clinic` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} antialiased bg-background text-foreground`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
