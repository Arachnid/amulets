import React from "react";
// import { PageHeader } from "antd";

import PageLayout from '../utils/PageLayout'

// // displays a page header

// export default function Header() {
//   return (
//     <PageHeader
//       title="Amulet Garden"
//       subTitle="Find and mint Amulets"
//     />
//   );
// }

const Header = () => {

  return (
    <React.Fragment>
        <nav className="header">
          <div>
            <a href="/scratchpad" className="nav-item">scratchpad</a>
          </div>
          <div>
            <a href="/collection" className="nav-item">collection</a>
          </div>
          <div>
            <a href="faq" className="nav-item">faq</a>
          </div>
        </nav>
        <div className="title" >
          <a href="/">
            <h1 className="site-title">Amulet~</h1>
          </a>
          <div className="site-description">
            An amulet is a kind of poem that depends on language, code, and luck.
          </div>
        </div>
    </React.Fragment>
  )
}

export default Header