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
BD_CreateBranding({
    type: 'maruska',
    creative: {
        first: {
            file: 'Marianne_Branding_1700x1200.jpg'
        },
        megaboard: {
            file: '',
            height: 150
        },
        background_color: '#fff'
    },
    tools: {
        pr_height: 0
    },
    pixel: 'https://track.adform.net/adfserve/?bn=16817086;1x1inv=1;srctype=3;ord=[timestamp]',
    ad_server: {
        url: '%%__URL%%',
        click_url: '%%__REDIRECT%%',
        click_url_encoded: '%%__REDIRECT_ENCODED%%',
        cd_ad_domain: '%%__CDN_AD_DOMAIN%%'
    },
    dev: true
});

// here please paste generated lib.min.js content!
```

You can override all object items what you can see in [branding.js](./src/branding.js#L3)