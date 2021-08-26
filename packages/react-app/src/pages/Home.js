import React from 'react'
import PageLayout from '../utils/PageLayout'

// import { AmuletCreator } from '../components'
// import { Row, Col, Button, Menu, Alert, Input, List, Card, Switch as SwitchD, Typography } from "antd";

const Home = (props) => {

    return (
        <PageLayout>
            <div style={{"textAlign": "center"}}>
                <img
                    alt="Amulets" 
                    src={process.env.PUBLIC_URL + './symbol-1.svg'}
                    className="amulet-symbol"
                />
            </div>
            <section className="body-text">
                <b>To qualify, a poem must satisfy these criteria:</b>
                <p style={{"paddingTop":"20px"}}>Its complete Unicode text is 64 bytes or less. The hexadecimal SHA-256 hash of the text includes four or more 8s in a row.</p>
            </section>
            <div style={{ "textAlign": "center" }}>    
                <img
                    alt="Amulets" 
                    src={process.env.PUBLIC_URL + './symbol-2.svg'}
                    className="amulet-symbol"
                />
            </div>
            <section className="body-text">
                <b>The rarity of the amulet is determined by the number of sequential 8s in the hash:</b>
                <ul style={{"listStyleType": "none", "paddingTop":"15px"}}>
                    <li style={{"textDecoration": "none"}}>8888: common</li>
                    <li style={{"textDecoration": "none"}}>88888: uncommon</li>
                    <li style={{"textDecoration": "none"}}>888888: rare</li>
                    <li style={{"textDecoration": "none"}}>8888888: epic</li>
                    <li style={{"textDecoration": "none"}}>88888888: legendary</li>
                    <li style={{"textDecoration": "none"}}>888888888: mythic</li>
                    <li style={{"textDecoration": "none"}}>8888888888+: ✦✦✦</li>
                </ul>
            </section>
        </PageLayout>
    )
}

// {props.address && <AmuletCreator contracts={props.contracts} provider={props.provider} />}
// {!props.address && <div>Connect your wallet to mint an amulet</div>}

export default Home