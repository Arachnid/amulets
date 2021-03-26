import React from "react";
import { Button, Form, Input, Typography, Alert } from "antd";
import { ethers } from "ethers";
import { useContractReader, useEventListener } from '../hooks';
import { useUserAddress } from "eth-hooks";
import { Transactor } from '../helpers';
import { Link } from "react-router-dom";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function AmuletRevealer(props) {
    const userAddress = useUserAddress(props.provider);
    const [pollingInterval, setPollingInterval] = React.useState(null);
    const amuletData = useContractReader(props.contracts, "Amulet", "getData", [props.amulet.id], pollingInterval);
    const tx = Transactor(props.provider);
    const [title, setTitle] = React.useState("");
    const [offset, setOffset] = React.useState("");
 
    React.useEffect(() => {
        if(amuletData && amuletData.blockRevealed != 0) {
            // Already revealed? Skip this step.
            props.onReveal({title, offset, id: props.amulet.id, text: props.amulet.text, rarity: props.amulet.rarity});
        }
    });

    const reveal = () => {
        tx(props.contracts.Amulet.reveal([title, props.amulet.text, offset]));
        setPollingInterval(5000);
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
                    <Button onClick={reveal} disabled={!props.contracts || !offset}>Reveal</Button>
                </Form.Item>
            </Form>
        </>);
    }
}
