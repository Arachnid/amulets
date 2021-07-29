import React from 'react';
import PageLayout from '../utils/PageLayout'

const Faq = () => {

    return (
        <PageLayout>
            <div className="faq-question">
                <b>What are the odds I’ll type something into <a href="/scratchpad">the scratchpad</a> and discover an amulet?</b>
                <p style={{"paddingTop": "10px"}}>Very, very, very, VERY low! It’s much more practical to “discover” amulets with a computer program. (The examples in the scratchpad were all produced in this way.)</p>
            </div>
        </PageLayout>
    )
}

export default Faq