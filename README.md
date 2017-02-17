# iBillboard, bbelements

script for showing branding

# Development

1. `npm install`
2. do your job in scripts
3. `gulp`
4. use new generated script in ./dist/`lib.min.js` for bbelements

# Using

Example:
```
createBranding({
    type: 'anicka',
    creative_first: 'Tesco_GHS_-_Xmass-11-12_16-branding.jpg',
    creative_second: 'xy.jpg',
    creative_megaboard: {
        file: 'Iris_970x120_chip/index.html'
    },
    background_color: '#fff',
    branding_width: 1900,
    branding_height: 1200,
    megaboard_height: 70,
    page_width: 980,
    element_class: 'branding_wrapper'
});

// here please paste generated lib.min.js content!
```

You can override all object items what you can see in [branding.js](./src/branding.js#L3)