import React, { useState } from 'react';
import PageLayout from '../utils/PageLayout'

const AmuletMaker = () => {

    const [translation, setTranslation] = useState(true)

    return (
        <React.Fragment>
            <PageLayout>
                <div
                    className="faq-question"
                >
                    <span
                        style={{ "textDecoration": translation ? "underline" : "none", "cursor": "pointer" }}
                        onClick={() => setTranslation(!translation)}
                    >
                        <b>English</b>
                    </span>
                    {" "}|{" "}
                    <span
                        style={{ "textDecoration": translation ? "none" : "underline", "cursor": "pointer" }}
                        onClick={() => setTranslation(!translation)}
                    >
                        <b>Chinese</b>
                    </span>
                </div>
                {translation ? 
                    <section className="faq-question">
                        Amulet 
                        <br/>
                        <br/>
                        Definition
                        <br/>
                        <br/>
                        An amulet is a kind of poem that depends on language, code, and luck. To qualify, a poem must satisfy these criteria:
                        <br/>
                        <br/>
                        Its complete Unicode text is 64 bytes or less.<sup>1</sup>
                        <br/>
                        The hexadecimal SHA-256 hash of the text includes four or more 8s in a row.<sup>2</sup>
                        <br/>
                        An amulet absolutely does not have to be recorded on a blockchain to be an amulet.
                        <br/>
                        <br/>
                        If an amulet is recorded on a blockchain, an additional formal criterion applies:
                        <br/>
                        <br/>
                        A carbon offset (1 metric ton or more) is purchased to compensate for the CO2 produced by the poem’s life on the blockchain, with proof of that purchase included in the poem’s metadata.
                        <br/>
                        <br/>
                        There are no other rules! An amulet can be written in any language and any style. It can be composed, generated, or “discovered” in any way.
                        <br/>
                        <br/>
                        The number of sequential 8s in the hash determines the rarity of the amulet:
                        <br/>
                        <ul style={{"listStyleType": "none", "paddingTop":"15px"}}>
                            <li style={{"textDecoration": "none"}}>8888: common</li>
                            <li style={{"textDecoration": "none"}}>88888: uncommon</li>
                            <li style={{"textDecoration": "none"}}>888888: rare</li>
                            <li style={{"textDecoration": "none"}}>8888888: epic</li>
                            <li style={{"textDecoration": "none"}}>88888888: legendary</li>
                            <li style={{"textDecoration": "none"}}>888888888: mythic</li>
                            <li style={{"textDecoration": "none"}}>8888888888+: ✦✦✦</li>
                        </ul>
                        And, while this isn’t part of the formal definition, it’s important to say that an amulet of any rarity should be judged by its overall effect, with consideration for both its linguistic and typographic qualities. In particular, an amulet’s whitespace, punctuation, and diacritics should all be “load bearing”.
                        <br/>
                        <br/>
                        A poem doesn’t become interesting simply by satisfying the constraints of some obscure form; likewise, an amulet isn’t collectible simply because it’s rare.
                        <br/>
                        <br/>
                        But... it doesn’t hurt.
                        <br/>
                        <br/>
                        A few stray considerations:
                        <br/>
                        <br/>
                        Special appreciation is reserved for the amulet that is, in any sense, “aware of its circumstances”.
                        <br/>
                        <br/>
                        It is tempting to stylize “amulet” as “amul8”; this, unfortunately, is too dorky.
                        <br/>
                        <br/>
                        There is significant luck involved in the production of amulets; you might consider them bouillon cubes of fortune, useful as ingredients in other recipes, digital and occult.
                        <br/>
                        <br/>
                        Footnotes:
                        <br/>
                        <br/>
                        <sup>1</sup> Unicode (UTF-8) characters often require more than one byte; most programming languages provide a function to determine the byte size of a string.
                        <br/>
                        <br/>
                        <sup>2</sup> For most programmers, the SHA-256 hash function will be familiar and close to hand. For other readers interested in seeing how it works, the scratchpad might be useful.
                        <br/>
                        <br />
                        <b>Discussion</b>
                        <br/>
                        <br />
                        The SHA-256 hash function is ubiquitous in cryptography. In Zora, for example, it’s used to
                        verify the identity of a piece of media, like a fingerprint. That media could be an MP4 movie, a
                        PNG image, or a poem in plain text; if you change one frame, one pixel, or one comma, you
                        change the SHA-256 hash entirely.
                        <br/>
                        <br />
                        The hash is a cold hexadecimal spew –
                        <br/>
                        9a120001cc88888363fc67c45f2c52447ae64808d497ec9d699dba0d74d72aab
                        <br/>
                        <br />
                        – and, like a fingerprint, it doesn’t tell you anything about the entity it identifies. That’s by design,
                        but even so, it feels strange for a value so pivotal to be totally disconnected from the underlying
                        content, especially when it is this value that’s being collected and traded in cryptographic
                        marketplaces.
                        <br/>
                        <br />
                        Ostensibly, the hash provides an immutable link between unique cryptographic object and free-
                        floating digital media.
                        <br/>
                        <br />
                        The amulet asks: what if we took that link seriously?
                        <br/>
                        In a sense, the definition of the SHA-256 hash function created, at a stroke, all amulets of all
                        rarities. Common to mythic, trashy to lovely, they have been hiding in the manifold combinations
                        of language; we just didn’t know we ought to be looking for them. Until now!
                        <br/>
                        <br />
                        How should we feel about this? I will invoke an amulet of uncommon rarity; you saw its SHA-
                        256 hash above, five 8s in a row, lucky indeed:
                        <br/>
                        <br />
                        If you can't write poems,
                        <br/>
                        write me
                        <br />
                        <br />
                        <b>Amulet faq</b>
                        <br/>
                        <br/>
                        <div className="faq-question">
                            <b>What are the odds I’ll type something into <a href="/scratchpad">the scratchpad</a> and discover an amulet?</b>
                            <p>Very, very, very, VERY low! It’s much more practical to “discover” amulets with a computer program. (The examples in the scratchpad were all produced in this way.)</p>
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
                    </section>
                :
                    <section className="faq-question">
                        护身符  
                        <br/>
                        <br/>
                        定义
                        <br/>
                        <br/>
                        护身符是一种依赖语言、密码和运气的诗词。一首诗词必须满足这些条件，才算合格：
                        <br/>
                        <br/>
                        它的完整Unicode文本为64字节或更少。<sup>1</sup>
                        <br/>
                        文本的十六进制SHA-256哈希值在一行中包含4个或更多8。<sup>2</sup>
                        <br/>
                        护身符完全不必被记录在区块链上，就可以成为护身符。
                        <br/>
                        <br/>
                        如果护身符被记录在区块链上，则适用另一个额外的正式标准:
                        <br/>
                        <br/>
                        购买碳补偿（1公吨或更多），以补偿诗词在区块链上的生命存在所产生的二氧化碳，并在诗词的元数据中提供购买证明。
                        <br/>
                        <br/>
                        没有其他规则! 一个护身符可以用任何语言和任何风格来写。它可以以任何方式组成、生成或 "发现"。
                        <br/>
                        <br/>
                        哈希中连续的8的数量决定了护身符的稀有性:
                        <br/>
                        <ul style={{"listStyleType": "none", "paddingTop":"15px"}}>
                            <li style={{"textDecoration": "none"}}>8888: 普通</li>
                            <li style={{"textDecoration": "none"}}>
                            88888: 不常见
                            </li>
                            <li style={{"textDecoration": "none"}}>
                            888888: 稀有
                            </li>
                            <li style={{"textDecoration": "none"}}>
                            8888888: 史诗
                            </li>
                            <li style={{"textDecoration": "none"}}>
                            88888888: 传奇
                            </li>
                            <li style={{"textDecoration": "none"}}>
                            888888888: 神话
                            </li>
                            <li style={{"textDecoration": "none"}}>
                            8888888888+: ✦✦✦
                            </li>
                        </ul>
                        而且，虽然这不是正式定义的一部分，但重要的是，任何罕见的护身符都应该根据其整体效果来判断，同时考虑其语言和排版质量。特别是，护身符的空格、标点符号和变音符号都应该是“有承载能力的”。
                        <br/>
                        <br/>
                        一首诗词不会因为满足某些晦涩的形式的限制而变得有趣；同样地，一个护身符也不会因为它的稀有度而具有收藏价值。
                        <br/>
                        <br/>
                        但是......这并不要紧。
                        <br/>
                        <br/>
                        一些游离的考虑：
                        <br/>
                        <br/>
                        对那些在任何意义上都 “意识到自己处境” 的护身符，我们要特别欣赏。
                        <br/>
                        <br/>
                        大家很容易将 “护身符” 的风格化为 “amul8”；但不幸的是，这并不太聪明。
                        <br/>
                        <br/>
                        护身符的生产涉及到极大的运气；你可以把它们看作是财富浓缩肉汤块，用作为其他食谱、数字和神秘学的成分。
                        <br/>
                        <br/>
                        脚注：
                        <br/>
                        <br/>
                        <sup>1</sup> Unicode（UTF-8）字符通常需要一个以上的字节；大多数编程语言都提供一个函数来确定字符串的字节大小。
                        <br/>
                        <br/>
                        <sup>2</sup>  对于大多数程序员来说，SHA-256哈希函数将是熟悉，并且非常容易掌握的。对于其他有兴趣了解其工作原理的读者来说，scratchpad可能是有用的。
                        <br/>
                        <br />
                        <b>讨论</b>
                        <br/>
                        <br />
                        SHA-256哈希函数在密码学中无处不在。例如，在Zora中，它被用来验证一个媒体的身份，就像一个指纹。该媒体可以是一个MP4电影、一个PNG图像，或一首纯文本的诗词；如果你改变一个帧、一个像素，或一个逗号，你会完全改变SHA-256哈希值。
                        <br/>
                        <br />
                        哈希值是一个冰冷的十六进制喷出物 –
                        <br/>
                        9a120001cc88888363fc67c45f2c52447ae64808d497ec9d699dba0d74d72aab
                        <br/>
                        <br />
                        – 而且，就像指纹一样，它不会告诉你它所识别的实体的任何信息。这是设计好的，但即便如此，如此关键的价值与底层内容完全脱节还是让人感觉很奇怪，尤其是当这个价值在加密市场被收集和交易时。
                        <br/>
                        <br />
                        从表面上来看，哈希值在独特的加密对象和自由漂浮的数字媒体之间提供了一个不可更改的链接。
                        <br/>
                        <br />
                        护身符问道：如果我们认真对待这种联系呢？
                        <br/>
                        在某种意义上，SHA-256哈希函数的定义一举创造了所有稀有的护身符。从普通到神话，从垃圾到可爱，它们一直隐藏在语言的多种组合中；我们只是不知道我们应该去寻找它们。直到现在!
                        <br/>
                        <br />
                        我们应该如何看待这个问题？我将引用一个罕见的护身符；你看到上面的SHA-256哈希值，连续五个8连在一起，确实很幸运：
                        <br/>
                        <br />
                        如果你不会写诗词，
                        <br/>
                        写信给我
                        <br/>
                        <br />
                        <b>护身符常见问题</b>
                        <br/>
                        <br/>
                        <div className="faq-question">
                            
                            <b>我在<a href="/scratchpad">scratchpad</a>上输入内容，然后发现一个护身符的几率有多大?</b>
                            <p>非常、非常、非常、非常低!用电脑程序“发现”护身符要实际得多。(scratchpad中的示例都是以这种方式生成的。)</p>
                        </div>
                        <div className="faq-question">
                            <b>用晦涩难懂的Unicode字符来点缀一首诗词，不是可以很容易地生成稀有的护身符吗？</b>
                            <p>是的。</p>
                        </div>
                        <div className="faq-question">
                            <b>如果我这样做，会有人赏识吗？</b>
                            <p>不会。</p>
                        </div>
                        <div className="faq-question">
                            <b>在接下来的旅程中，你有什么可以帮助我的吗?</b>
                            <p>就拿这三个常见的风之护身符为例吧：
                                <ol className="ordered-faq">
                                    <li>
                                        <span>夜晚的风有一个梦</span>
                                    </li>
                                    <li>风：
                                    别问我是什么</li>
                                    <li>一股风，把这吹回给我</li>
                                </ol>
                            </p>
                        </div>
                    </section>
                }
            </PageLayout>
        </React.Fragment>
    )
}

export default AmuletMaker