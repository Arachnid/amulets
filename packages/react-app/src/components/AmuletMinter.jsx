import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { ethers } from "ethers";
import { useContractReader, useEventListener } from '../hooks';
import { useUserAddress } from "eth-hooks";
import { Transactor } from '../helpers';
import { Link } from "react-router-dom";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function AmuletMinter(props) {
    const Amulet = props.writeContracts.Amulet;
    const userAddress = useUserAddress(Amulet.provider);
    const amuletData = useContractReader(props.readContracts, "Amulet", "getData", [props.amulet.id]);
    // Listen for mint events on the Amulet contract. We don't actually have to use this, as triggering it will cause us to check
    // for amulet ownership below and redirect if it's been minted.
    const mintEvents = useEventListener(props.readContracts, "Amulet", "TransferSingle", undefined, undefined, {from: ZERO_ADDRESS});

    React.useEffect(() => {
        if(amuletData && amuletData.owner !== ZERO_ADDRESS) {
            // Already minted? Skip this step.
            props.onMint();
        }
    })

    const tx = Transactor(Amulet.provider);

    const mint = () => {
        tx(Amulet.mint(userAddress, props.amulet.id));
    };
    if(!amuletData) {
        return <Typography.Text>Checking amulet ownership...</Typography.Text>;
    } else {
        return (<Form>
            <Form.Item label="Amulet"><Typography.Text style={{whiteSpace: "pre"}}>{props.amulet.text}</Typography.Text></Form.Item>
            <Form.Item label="Rarity"><Typography.Text>{props.amulet.rarity}</Typography.Text></Form.Item>
            <Form.Item>
                <Button onClick={props.onBack}>Back</Button>
                <Button onClick={mint}>Mint</Button>
            </Form.Item>
        </Form>);
    }
}
