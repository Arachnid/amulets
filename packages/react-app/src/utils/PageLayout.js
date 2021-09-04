import React from 'react';


const PageLayout = ({children}) => {

    return (
        <section style={{ width:"auto", margin: "auto", marginTop:32, paddingBottom:32, "maxWidth": "640px" }}>
            {children}
        </section>
    )
}

export default PageLayout