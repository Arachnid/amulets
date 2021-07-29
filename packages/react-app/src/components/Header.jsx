import React from "react";
// import { PageHeader } from "antd";

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
  )
}

export default Header