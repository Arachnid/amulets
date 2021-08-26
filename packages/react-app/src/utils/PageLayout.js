import React from 'react';


const PageLayout = ({children}) => {

    return (
        <section style={{ width:640, margin: "auto", marginTop:32, paddingBottom:32 }}>
            {children}
        </section>
    )
}

export default PageLayout