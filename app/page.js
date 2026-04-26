import Copyright from "@/components/footers/Copyright";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";

import Hero from "@/components/home/Hero";

import Services from "@/components/common/Services";

import CommonComponents from "@/components/common/CommonComponents";
import Solutions from "@/components/solutions/Solutions";
import IubendaWidget from "@/components/widget/IubendaWidget";
import QuoteWidget from "@/components/form/quote-app/QuoteWidget";

import ScrollToSection from "./ScrollToSection";

export const metadata = {
  title: "EB - Soluzioni Web",
  description:
    "Realizzazione di siti web e applicazioni interattive per aziende e professionisti.",
};
export default function Home() {
  return (
    <>
      <ScrollToSection />
      <Header1 />
      <Hero />
      <Services />
      <section className="responsive-order">
        <Solutions />
        <QuoteWidget />
      </section>
      <Footer1 />
      <Copyright />
      <CommonComponents />
      <IubendaWidget />
    </>
  );
}
