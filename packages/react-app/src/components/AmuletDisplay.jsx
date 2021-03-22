import React from "react";
import { Button, Form, Input, Typography, Alert } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { ethers, BigNumber } from "ethers";
import { useContractReader, useEventListener } from '../hooks';
import { Transactor } from '../helpers';
import { Link } from "react-router-dom";
import AmuletAddress from "../contracts/Amulet.address.js";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function AmuletDisplay(props) {
    const opensea_url = `https://opensea.io/assets/${AmuletAddress}/${BigNumber.from(props.amulet.id).toString()}`
    return (
        <Form>
            <Form.Item label="Title"><Typography.Text>{props.amulet.title}</Typography.Text></Form.Item>
            <Form.Item label="Amulet"><Typography.Text style={{whiteSpace: "pre"}}>{props.amulet.text}</Typography.Text></Form.Item>
            <Form.Item label="Rarity"><Typography.Text>{props.amulet.rarity}</Typography.Text></Form.Item>
            <Form.Item label="OpenSea Link"><Typography.Text><a href={opensea_url}><LinkOutlined /></a></Typography.Text></Form.Item>
            <Form.Item>
                <Button onClick={props.onBack}>Back</Button>
            </Form.Item>
        </Form>);
}
