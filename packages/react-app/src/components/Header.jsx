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
      <a href="/scratchpad" className="nav-item">scratchpad</a>
      <a href="/collection" className="nav-item">collection</a>
      <a href="faq" className="nav-item">faq</a>
    </nav>
  )
}

export default Header