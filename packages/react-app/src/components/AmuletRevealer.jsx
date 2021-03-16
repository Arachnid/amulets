import React from "react";
import { Button, Form, Input, Typography, Alert } from "antd";
import { ethers } from "ethers";
import { useContractReader, useEventListener } from '../hooks';
import { useUserAddress } from "eth-hooks";
import { Transactor } from '../helpers';
import { Link } from "react-router-dom";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function AmuletRevealer(props) {
    const Amulet = props.writeContracts.Amulet;
    const userAddress = useUserAddress(Amulet.provider);
    const amuletData = useContractReader(props.readContracts, "Amulet", "getData", [props.amulet.id]);
    const tx = Transactor(Amulet.provider);
    const [title, setTitle] = React.useState("");
    const [offset, setOffset] = React.useState("");
    // Listen for mint events on the Amulet contract. We don't actually have to use this, as triggering it will cause us to check
    // for amulet ownership below and redirect if it's been minted.
    const mintEvents = useEventListener(props.readContracts, "Amulet", "AmuletRevealed", undefined, undefined, {tokenId: props.amulet.id});

    React.useEffect(() => {
        if(amuletData && amuletData.blockRevealed != 0) {
            // Already revealed? Skip this step.
            props.onReveal();
        }
    });

    const reveal = () => {
        tx(Amulet.reveal(title, props.amulet.text, offset));
    };

    if(!amuletData) {
        return <Typography.Text>Fetching amulet data...</Typography.Text>;
    } else {
        return (<>
            {userAddress !== amuletData.owner && <Alert message="Warning" description="This Amulet is owned by someone else. You can still reveal it if you wish, but they will own the revealed amulet!" type="warning" showIcon />}
            <Form>
                <Form.Item label="Title"><Input.TextArea value={title} onChange={({target: { value }}) => setTitle(value)} /></Form.Item>
                <Form.Item label="Amulet"><Typography.Text style={{whiteSpace: "pre"}}>{props.amulet.text}</Typography.Text></Form.Item>
                <Form.Item label="Carbon Offset URL"><Input.TextArea value={offset} onChange={({target: { value }}) => setOffset(value)} /></Form.Item>
                <Form.Item label="Rarity"><Typography.Text>{props.amulet.rarity}</Typography.Text></Form.Item>
                <Form.Item>
                    <Button onClick={props.onBack}>Back</Button>
                    <Button onClick={reveal}>Reveal</Button>
                </Form.Item>
            </Form>
        </>);
    }
}
