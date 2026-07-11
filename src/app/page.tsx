import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Music from "@/components/Music";
import Live from "@/components/Live";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import Format from "@/components/Format";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StickyPlayer from "@/components/StickyPlayer";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col bg-[#0d0d0d] text-white overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay"></div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Music Section */}
      <Music />

      {/* Live Section */}
      <Live />

      {/* Experience Section */}
      <Experience />

      {/* Gallery Section */}
      <Gallery />

      {/* Format Section */}
      <Format />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Sticky Player */}
      <StickyPlayer />
    </main>
  );
}
