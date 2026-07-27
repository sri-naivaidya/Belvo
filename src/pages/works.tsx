import SEO from "@/components/SEO";
import PortfolioSection from "@/sections/PortfolioSection";
import IntegrationsSection from "@/sections/IntegrationsSection";
import Footer from "@/sections/Footer";

export default function Works() {
  return (
    <>
      <SEO title="Our Works" description="Explore Belvo's portfolio of brands we've built, campaigns we've run, and creative work we're proud of." path="/works" />
      <PortfolioSection id="portfolio" />
      <IntegrationsSection />
      <Footer />
    </>
  );
}
