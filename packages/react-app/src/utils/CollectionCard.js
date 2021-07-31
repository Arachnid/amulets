import React from 'react';

const CollectionCard = ({ transaction }) => {

    const {header, title, rarity, author, timestamp} = transaction

        //! "header": "If you can't write poems, write me",
        //! "title": "title: instructions to the prospector",
        //! "rarity": "rarity: uncommon",
        //! "author": "author: 0x8888 (me)",
        //! "timestamp": ["2021-02-23 — sold to 0xEC6D"]

    return (
        <div style={{"padding-top":"84px"}}>
            <div className="collection-card">
                <h1 className="transaction-header">{header}</h1>
            </div>
                <div className="transaction-body">
                    <div>{title}, <span>{rarity}</span> <span style={{"float": "right"}}><div>{author}</div></span></div>
                </div>
        </div>
    )
}

export default CollectionCard