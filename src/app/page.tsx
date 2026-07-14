import Loading from "@/components/Loading";
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
import { StarsBackground } from "@/components/StarsBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col text-white selection:bg-red-600 selection:text-white bg-black">
      <StarsBackground starColor="#cccccc">
        {/* Loading Screen */}
        <Loading />

        {/* Noise Overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay z-50"></div>

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

        {/* Format Section */}
        <Format />

        {/* Gallery Section */}
        <Gallery />

        {/* Contact Section */}
        <Contact />

        {/* Footer */}
        <Footer />

        {/* Sticky Player */}
        <StickyPlayer />
      </StarsBackground>
    </main>
  );
}
