import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillsMarquee from "@/components/SkillsMarquee";
import Services from "@/components/Services";
import LaptopScroll from "@/components/LaptopScroll";
import DevParallax from "@/components/DevParallax";
import AboutNarrative from "@/components/AboutNarrative";
import About from "@/components/About";
import SkillsToolkit from "@/components/SkillsToolkit";
import Achievements from "@/components/Achievements";
import Blog from "@/components/Blog";
import HireCTA from "@/components/HireCTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <SkillsMarquee />
        <Services />
        <LaptopScroll />
        <DevParallax />
        <AboutNarrative />
        <About />
        <SkillsToolkit />
        <Achievements />
        <Blog />
        <HireCTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
