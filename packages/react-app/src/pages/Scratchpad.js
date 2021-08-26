import React from 'react';
import PageLayout from '../utils/PageLayout'
import { AmuletCreator } from '../components'

const Scratchpad = (props) => {

    console.log(props.address)
    return (
        <PageLayout>
            {props.address && <AmuletCreator contracts={props.contracts} provider={props.provider} />}
            {!props.address && <div>Connect your wallet to mint an amulet</div>}
        </PageLayout>
    )
}

export default Scratchpad