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
            <Steps size="small" current={step}>
                <Steps.Step title="Find an Amulet" />
                <Steps.Step title="Mint your Amulet" />
                <Steps.Step title="Reveal your Amulet" />
                <Steps.Step title="Done" />
            </Steps>
            {step === 0 && <AmuletFinder onFind={(amulet) => { setAmulet(amulet); setStep(1) }} />}
            {step === 1 && <AmuletMinter contracts={props.contracts} provider={props.provider} amulet={amulet} onBack={onBack} onMint={() => setStep(2)} />}
            {step === 2 && <AmuletRevealer contracts={props.contracts} provider={props.provider} amulet={amulet} onBack={onBack} onReveal={(amulet) => { setAmulet(amulet); setStep(3); }} />}
            {step === 3 && <AmuletDisplay amulet={amulet} onBack={onBack} />}
        </>
    );
}
