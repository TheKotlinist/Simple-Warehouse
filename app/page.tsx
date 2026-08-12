import CallToAction from "@/components/call-to-action-1";
import Content from "@/components/content-1";
import Features from "@/components/features-1";
import Footer from "@/components/footer-2";
import HeroSection from "@/components/hero-section-1";
import Integrations from "@/components/integrations-1";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <Features />
      <Integrations />
      <Content />
      <CallToAction />
      <Footer />
    </div>
  );
}
