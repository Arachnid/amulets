import React, { useState } from 'react';
import PageLayout from '../utils/PageLayout'
import CollectionData from '../utils/collection.json'
import CollectionCard from '../utils/CollectionCard'


const Collection = () => {

    const [firstDisplay, setFirstDisplay] = useState(false)

    const [secondDisplay, setSecondDisplay] = useState(false)

    let flipClass = ''

    if (firstDisplay) {
        flipClass = 'flip'
    }

    if (secondDisplay) {
        flipClass = 'flip'
    }

    return (
        <PageLayout>
            <section className="body-text">
                <p>Noteworthy amulets</p>
            </section>
            <div style={{ "textAlign": "center", "paddingTop": "20px", "paddingBottom": "5px"}}>    
                <img
                    alt="Amulets" 
                    src={process.env.PUBLIC_URL + './symbol-2.svg'}
                    className="amulet-symbol"
                />
            </div>
            <section>
                <section className="collection-grid">
                    {CollectionData.map((transaction) => <CollectionCard transaction={transaction} />)}
                </section>
            </section>
        </PageLayout>
    )
}

            // <section>
            //     <p style={{ "textDecoration": "underline", "textAlign": "center" }}>Here’s my eight amulets.</p>
            //     <div className={flipClass} style={{ "textAlign": "center" }} >
            //         <img
            //             alt="Amulets" 
            //             src="https://img.icons8.com/material-sharp/24/000000/give-way--v1.png"
            //             onClick={() => setFirstDisplay(!firstDisplay)}
            //         />
            //     </div>
            //     {firstDisplay ? 
            //         <section className="collection-grid">
            //             {CollectionData.map((transaction) => <CollectionCard transaction={transaction} />)}
            //         </section>
            //     :
            //         null}
            // </section>

//             <section className="body-text">
//                 <p><div style={{"textDecoration":"underline"}}>Here's a sampling of amulets written by other people;</div>
//                 some were discovered by chance, others with the help of “poem mining” software.
// This is, again, totally non-comprensive:</p>
//                 <div className={flipClass} style={{ "textAlign": "center" }} >
//                     <img
//                         alt="Amulets" 
//                         src="https://img.icons8.com/material-sharp/24/000000/give-way--v1.png"
//                         onClick={() => setSecondDisplay(!secondDisplay)}
//                     />
//                 </div>
//                 {secondDisplay ? 

//                 :
//                     null}
//             </section>

export default Collection