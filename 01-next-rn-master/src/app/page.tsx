import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ThemeCheck from "@/components/landing/ThemeCheck";
import LandingHeader from "@/components/layout/landing.header";
import Footer from "@/components/layout/landing.footer";


export default async function Home() {
  return (
    <main>
      <LandingHeader />

      <ThemeCheck />

      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
