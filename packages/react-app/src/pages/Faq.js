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
                <p>This question is, unfortunately, beyond the scope of this website. Zora <a href="https://help.zora.co/en/articles/4876846-what-is-a-nft" target="_blank" rel="noopener noreferrer">
                    offers a FAQ of its own
                </a> that’s worth reading, along with a <a href="https://zora.engineering/" target="_blank" rel="noopener noreferrer">detailed schematic</a> for the technically-inclined.</p>
            </div>
            <div className="faq-question">
                <b>Isn’t it possible to generate rare amulets easily by larding a poem with obscure Unicode characters?</b>
                <p>Yes.</p>
            </div>
            <div className="faq-question">
                <b>Will anyone be impressed if I do this?</b>
                <p>No.</p>
            </div>
            {/* <div className="faq-question">
                <b>Who made this website?</b>
                <p>Me, Robin!</p>
            </div> */}
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
        </PageLayout>
    )
}

export default Faq