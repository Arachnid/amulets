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
        return (
            <div style={{"paddingTop":"20px", "fontSize":"18px", "textAlign":"center"}}>
                Fetching amulet data...
            </div>
        )
    } else {
        return (<>
            {userAddress !== amuletData.owner && <Alert message="Warning" description="This Amulet is owned by someone else. You can still reveal it if you wish, but they will own the revealed amulet!" type="warning" showIcon />}
            <form
                className="ant-form-item-control-input-content"
                style={{ "width": "100%", "fontSize": "18px" }}>
                <div style={{"paddingTop": "20px", "fontSize": "18px"}}>
                    <label>Title:</label>
                    <br />
                    <input
                        className="amulet-input"
                        type="text"
                        value={title}
                        onChange={({ target: { value } }) => setTitle(value)}
                    />
                </div>
                <div style={{"paddingTop": "20px", "fontSize": "18px"}}>
                    <div>
                        Amulet:
                        <span style={{"paddingLeft":"1rem"}}>
                            {props.amulet.text}
                        </span>
                    </div>
                </div>
                <div style={{ "paddingTop": "20px", "fontSize": "18px" }}>
                    <label>Carbon Offset URL:</label>
                    <br />
                    <textarea
                        rows={1}
                        cols={50}
                        value={offset}
                        className="amulet-textarea"
                        onChange={({ target: { value } }) => setOffset(value)}
                    />
                </div>
                <div style={{ "paddingTop": "20px", "fontSize": "18px" }}>
                    <div>
                        Rarity: 
                        <span style={{"paddingLeft":"1rem"}}>
                            {props.amulet.rarity}
                        </span>
                    </div>
                </div>
                <div style={{"paddingTop":"20px", "fontSize":"18px"}}>
                    <a
                        onClick={props.onBack}
                        style={{"cursor":"pointer"}}
                    >
                        Back
                    </a>
                    <span
                        onClick={reveal}
                        style={{ "float": "right", "cursor": "pointer" }}
                        disabled={!props.contracts || !offset}
                    >
                        Reveal
                    </span>
                </div>
            </form>
        </>);
    }
}
