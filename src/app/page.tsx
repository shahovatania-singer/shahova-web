import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Music from "@/components/Music";
import Live from "@/components/Live";
import Experience from "@/components/Experience";
import Format from "@/components/Format";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col bg-[#0d0d0d] text-white overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay"></div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Music Section */}
      <Music />

      {/* Live Section */}
      <Live />

      {/* Experience Section */}
      <Experience />

      {/* Format Section */}
      <Format />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
