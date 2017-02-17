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
    creative: {
        first: {
            file: 'Tesco_GHS_-_Xmass-11-12_16-branding.jpg'
        },
        second: {
            file: 'xy.jpg'
        },
        megaboard: {
            file: 'Iris_970x120_chip/index.html'
            width: 123,
            height: 456
        },
        background_color: '#fff',
    }
});

// here please paste generated lib.min.js content!
```

You can override all object items what you can see in [branding.js](./src/branding.js#L3)