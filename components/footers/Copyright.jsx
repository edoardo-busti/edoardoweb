import React from "react";
import Link from "next/link";
export default function Copyright() {
  return (
    <div className="copyright-area-one">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-wrapper">
              <p className="copy-right-para tmp-link-animation">
                Copyright {new Date().getFullYear()} © Edoardo Busti | Tutti i
                diritti sono riservati
              </p>{" "}
              <ul className="tmp-link-animation dark-content">
                <li>
                  <p>Partita IVA IT 13419130011</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
