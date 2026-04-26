import Copyright from "@/components/footers/Copyright";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";

import CommonComponents from "@/components/common/CommonComponents";

import IubendaWidget from "@/components/widget/IubendaWidget";

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
      <section style={{ height: "100vh", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <h1 style={{ fontSize: "80px" }}>404</h1>
          <p style={{ marginBottom: "30px", fontSize: "30px" }}>
            Questa pagina non esiste!
          </p>
          <button className="tmp-btn">
            <a href="/" style={{ color: "white" }}>
              Torna alla home
            </a>
          </button>
        </div>
      </section>
      <Footer1 />
      <Copyright />
      <CommonComponents />
      <IubendaWidget />
    </>
  );
}
