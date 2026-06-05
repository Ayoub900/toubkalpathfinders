import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import WhyChoose from "@/components/WhyChoose";
import MeetMountain from "@/components/MeetMountain";
import AdventuresSection from "@/components/AdventuresSection";
import Difference from "@/components/Difference";
import Food from "@/components/Food";
import Sustainable from "@/components/Sustainable";
import Team from "@/components/Team";
import Reviews from "@/components/Reviews";
import FaqSection from "@/components/FaqSection";
import FinalCta from "@/components/FinalCta";
import Reveal from "@/components/Reveal";
import { getTreks } from "@/lib/treks";

// Reflect live trek changes from the database rather than build-time data.
export const dynamic = "force-dynamic";

export default async function Home() {
  const treks = await getTreks();
  return (
    <>
      <Hero />
      <Marquee />
      <WhyChoose />
      <MeetMountain />
      <AdventuresSection treks={treks} />
      <Difference />
      <Food />
      <Sustainable />
      <Team />
      <Reviews />
      <FaqSection />
      <FinalCta />
      <Reveal />
    </>
  );
}
