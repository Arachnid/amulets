import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { ethers, utils } from "ethers";

function scoreAmulet(text) {
    const hash = ethers.utils.sha256(Buffer.from(text));
    console.log("hash", hash)
    let longest = 0;
    let current = 0;
    for(let i = 0; i < hash.length; i++) {
        if(hash[i] == '8') {
            current++;
            longest = Math.max(longest, current);
        } else {
            current = 0;
        }
    }
    
    return longest
}

const RARITIES = {
    0: 'None',
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'Common',
    5: 'Uncommon',
    6: 'Rare',
    7: 'Epic',
    8: 'Legendary',
    9: 'Mythic'
};

const exampleAmulets = [
    "decentralized",
    "at.amulet.garden",
    "perhaps.eth",
    "for the data being hashed – this is dire",
    "[Exit.]",
    "That is always best which gives me to myself.",
    "non-being",
    "And the seas will lift as the night.",
    // "an old person:\nhe opens his door\nand looks out\non the street"
]

const getRandomAmulet = () => {
    return exampleAmulets[Math.floor(Math.random() * exampleAmulets.length)]
}

function countUtf8Bytes(s){
    var b = 0, i = 0, c
    for(;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
    return b
}

export default function AmuletFinder(props) {
    const [text, setText] = React.useState('');
    const score = scoreAmulet(text);
    const id = ethers.utils.keccak256(Buffer.from(text));
    const hash = ethers.utils.sha256(Buffer.from(text))
    const rarity = countUtf8Bytes(text) > 64 ? "Too Long" : (RARITIES[score] || 'Beyond Mythic');

    return (
        <Form>
            
            <Form.Item label="">
                <textarea
                    className="amulet-textarea"
                    rows={1}
                    cols={50}
                    value={text}
                    placeholder={"Type your poem here ..."}
                    onChange={(e) => setText(e.target.value)}
                />
            </Form.Item>
                <div style={{"textDecoration":"underline"}}>
                    <a
                        style={{"textDecoration":"underline", "color": "#bdbdbd"}}
                        onClick={() => setText(getRandomAmulet())}
                    >
                        Load example
                    </a>
                        <button
                            id="next-button"
                            style={{"float": "right"}}
                            className="next-step"
                            disabled={score < 4 ? true : false}
                            onClick={() => props.onFind({text, score, id, rarity})}
                        >
                            <span className="next" style={{ "color": "#0038FF", "paddingLeft": "2px", "cursor": "pointer"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={score > 3 ? "#0038FF" : "#bdbdbd"} className="next-arrow">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                                <div 
                                    style={{"color":`${score > 3 ? "#0038FF" : "#bdbdbd"}` }}
                                >
                                    Next
                                </div>
                        </button>
                </div>
                {rarity !== 'None' ? 
                    <>
                        <div style={{"textAlign": "center", "fontSize":"24px", "paddingTop":"20px", "paddingBottom":"20px"}}>
                            This is { rarity === 'Uncommon' || rarity === 'Epic' ? "an" : "a"} {rarity.toLowerCase()} amulet.
                        </div>
                        <div>
                        SHA-256 hash:
                            <span style={{"float": "right"}}>
                                {countUtf8Bytes(text)} bytes
                            </span>
                            <br/>
                            {hash.split('x')[1]}
                        </div>
                    </>
                : null}
        </Form>
    );
}
