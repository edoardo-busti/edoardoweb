import Accordion from "./Accordion";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Copyright from "@/components/footers/Copyright";
import IubendaPrivacyControls from "@/components/widget/IubendaWidget";
import CommonComponents from "@/components/common/CommonComponents";

export default function Faq() {
  return (
    <>
      <Header1 />
      <nav className="breadcrumb-area breadcrumb-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-inner text-center">
                <h1 className="title split-collab">FAQ</h1>
                <ul className="page-list">
                  <li className="tmp-breadcrumb-item">
                    <a href={`/`}>Home</a>
                  </li>
                  <li className="icon">
                    <i className="fa-solid fa-angle-right" />
                  </li>
                  <li className="tmp-breadcrumb-item active">FAQ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Accordion />
      <Footer1 />
      <Copyright />
      <IubendaPrivacyControls />
      <CommonComponents />
    </>
  );
}
