import React from "react";
import { Steps } from "antd";
import { ethers } from "ethers";
import { default as AmuletFinder } from "./AmuletFinder";
import { default as AmuletMinter } from "./AmuletMinter";
import { default as AmuletRevealer } from "./AmuletRevealer";
import { default as AmuletDisplay } from "./AmuletDisplay";

export default function AmuletCreator(props) {

    const [amulet, setAmulet] = React.useState(null);
    const [step, setStep] = React.useState(0);
    const onBack = () => setStep(0);
    return (
        <>
            <div style={{"textAlign": "center", "paddingBottom":"20px"}}>
                <img
                    alt="Amulets" 
                    src={process.env.PUBLIC_URL + './symbol-4.svg'}
                    className="amulet-symbol"
                />
            </div>
            <div>
                <span id={step === 0 ? 'active' : 'inactive'} style={{"float": "left"}}>Find an Amulet</span>
                <span id={step === 1 ? 'active' : 'inactive'} style={{"marginLeft": "30%"}}>Mint your Amulet</span>
                <span id={step === 2 ? 'active' : 'inactive'} style={{"float": "right"}}>Reveal your Amulet</span>
            </div>
            {step === 0 && <AmuletFinder onFind={(amulet) => { setAmulet(amulet); setStep(1) }} />}
            {step === 1 && <AmuletMinter contracts={props.contracts} provider={props.provider} amulet={amulet} onBack={onBack} onMint={() => setStep(2)} />}
            {step === 2 && <AmuletRevealer contracts={props.contracts} provider={props.provider} amulet={amulet} onBack={onBack} onReveal={(amulet) => { setAmulet(amulet); setStep(3); }} />}
            {step === 3 && <AmuletDisplay amulet={amulet} onBack={onBack} />}
        </>
    );
}
