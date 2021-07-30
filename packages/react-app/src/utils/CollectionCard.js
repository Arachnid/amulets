import React from 'react';

const CollectionCard = ({ transaction }) => {
    
    console.log(transaction)

    const {header, title, rarity, author, timestamp} = transaction

        //! "header": "If you can't write poems, write me",
        //! "title": "title: instructions to the prospector",
        //! "rarity": "rarity: uncommon",
        //! "author": "author: 0x8888 (me)",
        //! "timestamp": ["2021-02-23 — sold to 0xEC6D"]

    // console.log(header)
    return (
        <div style={{"paddingTop": "15px"}}>
            <h1 className="transaction-header">{header}</h1>
            <div className="transaction-body">
                <div>{title}</div>
                <div>{rarity}</div>
                <div>{author}</div>
                {timestamp.map((time) => <div>{time}</div>)}
            </div>
        </div>
    )
}

export default CollectionCard