import React, { useState } from 'react';
import PageLayout from '../utils/PageLayout'
import CollectionData from '../utils/collection.json'
import CollectionCard from '../utils/CollectionCard'

const Collection = () => {

    const [display, setDisplay] = useState(false)

    let flipClass = ''

    if (display) {
        flipClass = 'flip'
    }

    return (
        <PageLayout>
            <section className="body-text">
                <p>This page presents, first, the eight amulets I minted using the Zora protocol, then, a totally non-comprehensive sampling of amulets minted by others. The transaction log was most recently updated on April 17, 2021.</p>
            </section>
            <div style={{ "textAlign": "center", "paddingTop": "20px", "paddingBottom": "20px"}}>    
                <img
                    src={process.env.PUBLIC_URL + './symbol-2.svg'}
                    className="amulet-symbol"
                />
            </div>
            <section>
                <p style={{ "textDecoration": "underline", "textAlign": "center" }}>Here’s my eight amulets.</p>
                <div className={flipClass} style={{ "textAlign": "center" }} >
                    <img
                        src="https://img.icons8.com/material-sharp/24/000000/give-way--v1.png"
                        onClick={() => setDisplay(!display)}
                    />
                </div>
                {display ? 
                    <section className="collection-grid">
                        {CollectionData.map((transaction) => <CollectionCard transaction={transaction} />)}
                    </section>
                :
                    null}
            </section>
        </PageLayout>
    )
}

export default Collection