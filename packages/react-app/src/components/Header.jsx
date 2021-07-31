import React from "react";
// import { PageHeader } from "antd";

// import PageLayout from '../utils/PageLayout'

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

  // console.log(window.location.pathname.split('/')[1])

  let currentPage = window.location.pathname.split('/')[1]

  return (
    <React.Fragment>
        <nav className="header">
          <div>
            <a href="/scratchpad" className={currentPage === 'scratchpad' ? 'active' : 'nav-item'}>scratchpad</a>
          </div>
          <div>
            <a href="/collection" className={currentPage === 'collection' ? 'active' : 'nav-item'}>collection</a>
          </div>
          <div>
            <a href="faq" className={currentPage === 'faq' ? 'active' : 'nav-item'}>faq</a>
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