import imagegen

TEST_AMULETS = [
    "We sought a talisman old meaning, and francophone",
    "     ✦\n•  ° °\n•✯    \n. ·   \n✸ .   \n  ✶✸  ",
    " ✸  \n. *.\n   ✯\n *✦ ",
    "  °•* \n✦  ✯  \n  ★✯  \n      \n     ✯\n *  ✹ ",
    "   ★\n✶°°✦\n· ✯★\n★ • ",
    ".✦✷·\n ✵.*\n  ✯ \n✦   ",
    "at.amulet.garden",
    "onward.amulet.garden",
    "big.ass.amulet.sh",
    "Within your gang, your coven, you must protect",
    "perhaps.eth",
    "snap",
    "it words.",
    "= 69",
    "amul8hay5m27d1vrjleo3qw9qdhuwnmwr77dj5nf",
    "blur idle boy swarm\nfocus ensure test fat seed\nacid puppy doll",
    "own mind that the artist sought",
    "Amul888888888888888888888888888",
    "If you can't write poems,\nwrite me",
    "IN THE SPRING MY LUNGS\nSTILL SOMEHOW EXPAND.",
    "A MAN ONCE MAILED ME\nA PIECE OF HIS HEART",
    "THIS AMULET\nAT ANY PRICE\nFELT LIKE THE TRUTH",
    "this amulet is a simple token which proves my love's truth",
    "DON'T WORRY.",
    "in the early hours of the new year\ni lie on my back\nwaiting.",
    "All my life I had this\nimage of what a poet\nshould be",
    "chaiyya chaiyya",
    "THE REAL AMULET IS THE FRIENDS WE MADE ALONG THE WAY*",
    "i rove the plazas of gràcia,\ncrowds move by.\n\ncloth on faces",
    "🚬 👑 🍣",
    "Winter evening, a leaf, a blue sky above.",
    "Lethargically good.",
    "An amulet is a self-aware house? ",
    "for the data being hashed – this is dire",
    "😐💘",
    "🚽",
    "cYClOtRIMEThYLeNETrinItrAMiNE",
    "artERioLoscLEroSes",
    "👦🏼🎣",
    "aaAaAaaAaAaAAa",
    "«...i'm dancing in a nutshell»",
    "We do not do it...",
    "Yes, I am not sure, I.",
]

if __name__ == '__main__':
    for i, text in enumerate(TEST_AMULETS):
        img = imagegen.render(text)
        img.save('test_images/%d.png' % (i,))
