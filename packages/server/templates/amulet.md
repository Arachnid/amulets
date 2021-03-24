```
{{ info.amulet }}
```

# About this amulet
This is an amulet, a short poem with a lucky SHA-256 hash, explained [here](https://text.bargains/).

You can find and mint your own amulets at [amulet.garden](https://at.amulet.garden/).

This poem's rarity is {{ rarity }}.

{% if not info.offsetUrl %}
This poem does not have a carbon offset URL! This is a formal requirement to be an Amulet, but the author hasn't provided a valid URL.
{% else %}
[Here]({{info.offsetUrl|mdescape}}) is a record of the carbon offset purchased in this poem's name.
{% endif %}