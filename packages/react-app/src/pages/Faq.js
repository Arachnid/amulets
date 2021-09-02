import React from 'react';
import PageLayout from '../utils/PageLayout'

const Faq = () => {

    return (
        <PageLayout>
            <div className="faq-question">
                <b>What are the odds I’ll type something into <a href="/scratchpad">the scratchpad</a> and discover an amulet?</b>
                <p>Very, very, very, VERY low! It’s much more practical to “discover” amulets with a computer program. (The examples in the scratchpad were all produced in this way.)</p>
            </div>
            <div className="faq-question">
                <b>I discovered an amulet! What do I do?</b>
                <p>Anything you want! Save it, tweet it, put it in your email signature; write it on a piece of paper, then burn the paper; and/or simply bask in your good fortune.</p>
            </div>
            <div className="faq-question">
                <b>How do I mint my amulet?</b>
                <p>Go to the <a href="/scratchpad">scratchpad</a>, enter your amulet, and follow the directions.</p>
                <p>You can choose to just mint your amulet - in which case it will remain "a mysterious amulet" in the NFT view - or also reveal it to the world with a second transaction.</p>
            </div>
            <div className="faq-question">
                <b>Isn’t it possible to generate rare amulets easily by larding a poem with obscure Unicode characters?</b>
                <p>Yes.</p>
            </div>
            <div className="faq-question">
                <b>Will anyone be impressed if I do this?</b>
                <p>No.</p>
            </div>
            <div className="faq-question">
                <b>Do you have anything to help me with the journey ahead?</b>
                <p>Take these three common wind amulets:
                    <ol className="ordered-faq">
                        <li>
                            <span>the wind at night has a dream</span>
                        </li>
                        <li>the wind:
                        don't ask me what it is</li>
                        <li>a certain wind, to blow this back to me</li>
                    </ol>
                </p>
            </div>
            <div style={{"paddingTop":"20px"}}>
                <p>
                    Description is modified from Robin Sloan’s{" "}
                    <a
                        href="https://text.bargains/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{"textDecoration":"underline", "color":"blue"}}
                    >text.bargains</a>
                </p>
            </div>
        </PageLayout>
    )
}

export default Faq