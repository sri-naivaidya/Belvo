import SEO from "@/components/SEO";
import ToolsPricing from "@/sections/ToolsPricing";
import Footer from "@/sections/Footer";

export default function Tools() {
    return (
      <>
        <SEO title="Tools & Pricing" description="Access premium design and development tools through Belvo's managed subscriptions." path="/tools" />
        <ToolsPricing />
        <Footer />
      </>
    );
}