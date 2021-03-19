import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { ethers } from "ethers";

function scoreAmulet(text) {
    const hash = ethers.utils.sha256(Buffer.from(text));
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
    return longest;
}

const RARITIES = {
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

export default function AmuletFinder(props) {
    const [text, setText] = React.useState('');
    const score = scoreAmulet(text);
    const id = ethers.utils.keccak256(Buffer.from(text));
    const rarity = RARITIES[score] || 'Beyond Mythic';
    return (
        <Form>
            <Form.Item label="Amulet">
                <Input.TextArea rows={4} value={text} onChange={({target: { value }}) => setText(value)} />
            </Form.Item>
            <Form.Item label="Rarity">
                <Typography.Text>{rarity}</Typography.Text>
            </Form.Item>
            <Form.Item>
                <Button type="primary" disabled={score < 4} onClick={() => props.onFind({text, score, id, rarity})}>Next</Button>
            </Form.Item>
        </Form>
    );
}