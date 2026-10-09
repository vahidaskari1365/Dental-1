import { Suspense } from "react";
import { Header } from "@/components/site/header";
import { Hero, StatsBar } from "@/components/site/hero";
import { Services } from "@/components/site/services";
import { WhyUs } from "@/components/site/why-us";
import { Doctors } from "@/components/site/doctors";
import { Booking } from "@/components/site/booking";
import { Testimonials } from "@/components/site/testimonials";
import { PaymentSection, PaymentCallbackHandler } from "@/components/site/payment-card";
import { Faq } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { Chatbot } from "@/components/site/chatbot";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <Services />
        <WhyUs />
        <Doctors />
        <Booking />
        <Testimonials />
        <PaymentSection />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
      <Suspense fallback={null}>
        <PaymentCallbackHandler />
      </Suspense>
    </div>
  );
}
