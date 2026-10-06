import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Services from "@/components/Services";
import Work from "@/components/Work";
import { getSettings, getVideos } from "@/lib/data";

export const revalidate = 3600;

export default async function Home() {
  const [settings, videos] = await Promise.all([getSettings(), getVideos()]);
  return (
    <>
      <Nav />
      <main>
        <Hero hero={settings.hero} />
        <Work categories={settings.categories} videos={videos} />
        <Services services={settings.services} />
        <About about={settings.about} />
        <Contact contact={settings.contact} />
      </main>
      <Footer />
    </>
  );
}
