import React from 'react'
import PageLayout from '../utils/PageLayout'

import { AmuletCreator } from '../components'
import { Row, Col, Button, Menu, Alert, Input, List, Card, Switch as SwitchD, Typography } from "antd";

const Home = (props) => {

    return (
        <PageLayout>
            <h1>Home page</h1>
            {props.address && <AmuletCreator contracts={props.contracts} provider={props.provider} />}
              {!props.address && <Typography.Text>Connect your wallet to mint an amulet</Typography.Text>}
        </PageLayout>
    )
}

export default Home