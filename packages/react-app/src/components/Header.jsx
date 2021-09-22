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
            <a href="/amulet-maker" className={currentPage === 'amulet-maker' ? 'active' : 'nav-item'}>amulet maker</a>
          </div>
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
          <div style={{"text-align": "center"}}>
            <img
              style={{"paddingTop":"30px", "paddingBottom": "30px"}}
              src={process.env.PUBLIC_URL + "./Amulet-logo.svg"}
            />
          </div>
          </a>
          <div className="site-description">
            An amulet is a kind of poem that depends on language, code, and luck.
          </div>
        </div>
    </React.Fragment>
  )
}

export default Header