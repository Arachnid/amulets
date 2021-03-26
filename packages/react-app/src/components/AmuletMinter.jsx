import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { ethers } from "ethers";
import { useContractReader, useEventListener } from '../hooks';
import { useUserAddress } from "eth-hooks";
import { Transactor } from '../helpers';
import { Link } from "react-router-dom";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function AmuletMinter(props) {
    const userAddress = useUserAddress(props.provider);
    const [pollingInterval, setPollingInterval] = React.useState(null);
    const amuletData = useContractReader(props.contracts, "Amulet", "getData", [props.amulet.id], pollingInterval);

    React.useEffect(() => {
        if(amuletData && amuletData.owner !== ZERO_ADDRESS) {
            // Already minted? Skip this step.
            props.onMint();
        }
    })

    const tx = Transactor(props.provider);

    const mint = () => {
        tx(props.contracts.Amulet.mint([userAddress, props.amulet.id]));
        setPollingInterval(5000);
    };
    if(!amuletData) {
        return <Typography.Text>Checking amulet ownership...</Typography.Text>;
    } else {
        return (<Form>
            <Form.Item label="Amulet"><Typography.Text style={{whiteSpace: "pre"}}>{props.amulet.text}</Typography.Text></Form.Item>
            <Form.Item label="Rarity"><Typography.Text>{props.amulet.rarity}</Typography.Text></Form.Item>
            <Form.Item>
                <Button onClick={props.onBack}>Back</Button>
                <Button onClick={mint} disabled={!props.contracts}>Mint</Button>
            </Form.Item>
        </Form>);
    }
}
