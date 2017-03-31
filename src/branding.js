/**
 * Example use !!!
 */
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


/**
 * Merge deep objects
 * Credit: http://stackoverflow.com/a/20591261/3783469
 * @param target
 * @returns {*}
 */
function BD_Extend(target) {
    for(var i=1; i<arguments.length; ++i) {
        var from = arguments[i];
        if(typeof from !== 'object') continue;
        for(var j in from) {
            if(from.hasOwnProperty(j)) {
                target[j] = typeof from[j]==='object'
                    ? BD_Extend({}, target[j], from[j])
                    : from[j];
            }
        }
    }
    return target;
}

/**
 * Create css factory, todo: Object.keys(cssObject).reduce(fn, default), todo: media query
 * @param cssObject
 * @returns {string}
 */
function BD_GenerateCSS(cssObject)
{
    var css = '';
    for (cName in cssObject)
    {
        // create new class
        css += '.' + cName + '{';

        // class properties
        for(cProperty in cssObject[cName])
        {
            // for classes like: 'font-size' we must using 'font_size' in object and replacing it here
            var property = cProperty.replace('_', '-');

            // create row
            css += property + ':' + cssObject[cName][cProperty] + ';';
        }

        // end of class
        css += '}';
    }
    return css;
}

/**
 * Create branding factory
 * @param myOptions object
 */
function BD_CreateBranding(myOptions)
{
    // default states
    var is_front_page = false;
    var is_gallery    = false;

    const defaultOptions = {
        type:                       '',
        creative: {
            first: {
                file:               '',
                width:              1700,
                height:             1200
            },
            second: {
                file:               '',
                width:              1700,
                height:             1200
            },
            megaboard: {
                file:               '',
                width:              1000,
                height:             120
            },
            background_color:       '#fff',
            background_options:     ''
        },
        tools: {
            height:                 1200,
            pr_word:                'Promotion',
            pr_height:              15,
            drupal_toolbar_height:  80,
            element_id:             'page',
            class_front_page:       'front-page',
            class_gallery:          'gallery',
            class_active:           'branding-active',
            class_toolbar:          'toolbar-horizontal'
        },
        pixel:                      '',
        ad_server: {
            url:                    '',
            click_url:              '',
            click_url_encoded:      '',
            cd_ad_domain:           ''
        },
        page_width:                 980, // @todo: think about dynamic looking
        element_class:              'branding_wrapper',
        tpl_shared:                 true,
        dev:                        false,
        css:                        '',
        html:                       ''
    };

    // merge objects
    var args = BD_Extend({}, defaultOptions, myOptions);

    // vyska odsazeni webu
    //args.creative.megaboard.height += args.tools.pr_height;

    // is it gallery page?
    // get main wrapper
    var body = document.body;
    var page = document.getElementById(args.tools.element_id);

    if(!page)
    {
        if(args.dev){
            console.warn("element #" + args.tools.element_id + " not exists!")
        }
    }
    else
    {
        is_front_page = page.classList.contains(args.tools.class_front_page);
        is_gallery    = page.classList.contains(args.tools.class_gallery);
    }

    // zero padding
    if(is_gallery)
    {
        args.tools.pr_height = 0;
    }

    // allowed with superpowers
    switch(args.type)
    {
        // without action
        case 'anicka':
            args.creative.background_options = 'no-repeat center ' + args.tools.pr_height + 'px';
            break;

        // fixed bg
        case 'maruska':
            args.creative.background_options = 'no-repeat center ' + args.tools.pr_height + 'px'; //fixed
            break;

        // auto replicated
        case 'zuzanka':
            args.creative.background_options = 'repeat-y center ' + args.tools.pr_height + 'px';
            break;

        // with HTML banner to header
        case 'amalka':

            // check if valid
            if('' == args.creative.megaboard.file || args.creative.megaboard.file.indexOf('.html') !== -1){return alert('Please fill in creative.megaboard item file')}

            args.css+= '' +
                '.branding__megaboard iframe {margin:0px; border:0px}';
            
            args.html+="" +
                + "<div class='branding__megaboard'>"
                + "<iframe"
                + " src='" + args.creative.megaboard.file + "?redir=" + args.ad_server.click_url_encoded + "&bbtarget=_blank'"
                + " width='" + args.creative.megaboard.width + "'"
                + " height='" + args.creative.megaboard.height + "'"
                + " scrolling='no'"
                + " seamless>"
                + "</iframe>"
                + "</div>";

            break;

        // strip - not working right now, @todo!
        case 'rozarka':

            var backgroundDoubleLayerOptions = {
                impressionTrackingUrl: '',
                firstImageUrl:  args.ad_server.url + args.creative.first,
                secondImageUrl: args.ad_server.url + args.creative.second,
                clickUrl:       args.ad_server.click_url,
                background: {
                    position: 'center top',
                    attachment: 'scroll',
                    size: 'cover',
                    repeat: 'no-repeat'
                }
            };

            args.tpl_shared = false;

            (function(args) {
                try{var o=[].concat(args.options.impressionTrackingUrl),i,n;i=o.length;
                    while(i--){n = new Image(1,1);n.src = o[i].replace('[RANDOM]',Math.floor(
                        Math.random()*10e12));}}catch(p){}
                (window.bbCommonLib=window.bbCommonLib||(function(){var c=[],a={},e={},b
                        =function(){},x='<script ',y='"><\/script>';function d(f){if(typeof f
                        ==="string"&&!e[f]){document.write(x+'src="'+f+'" type="text/javascript'
                        +y);e[f]=""}}return{extend:function(f){b=f},registerScript:function(g,f)
                    {a[g]=f;b(a,c)},registerAd:function(f){var g="bb_"+(""+Math.random()).
                            substr(2);f.options.marker=g;document.write(x+'id="'+g+'" type="marker'+
                        y);c.push(f);d(f.library);d(f.script);b(a,c)}}})()).registerAd(args);
            }({
                options: backgroundDoubleLayerOptions,
                script : args.ad_server.cd_ad_domain + '/bb/creativelib/ad-scripts/background-double-layer/background-double-layer-script-1.01.js',
                library: args.ad_server.cd_ad_domain + '/bb/creativelib/creative-lib-1.02.32.min.js'
            }));

            break;

        default:
            if(args.dev) {
                console.warn('This is type is not allowed!');
            }
    }

    // target website element
    var element = document.getElementsByClassName(args.element_class);
    if(0 == element.length)
    {
        if(args.dev){
            console.warn('Not found wrapper for branding with class: ' + args.element_class + '. Using fallback to <body>.');
        }

        // element fallback
        element = body;
    }

    if(args.dev) {
        console.info('our main element:');
        console.info(element);
    }

    if(element.length)
    {
        // calculating
        var bb_WidthR       = ((args.creative.first.width - args.page_width) / 2);
        var bb_mRight       = bb_WidthR + args.page_width;
        var bb_tempWidth    = (( window.innerWidth - args.page_width) / 2) - 15;
        bb_tempWidth        = bb_tempWidth > bb_WidthR ? bb_WidthR : bb_tempWidth;

        // apply background
        element[0].classList.add(args.tools.class_active);

        if(args.tpl_shared)
        {
            // set wrapper background
            element[0].style.background = (args.creative.background_color ? args.creative.background_color : '') + ' url("'+ args.ad_server.url + args.creative.first.file +'") ' + args.creative.background_options;

            // default styles
            var cssObject = {
                promotion__megaboard: {
                    display:    'none'
                },
                promotion__branding: {
                    width:      args.page_width + 'px',
                    height:     + args.creative.megaboard.height + 'px',
                    position:   'relative',
                    margin:     '0 auto'
                },
                branding__bb3: {
                    width:      args.page_width + 'px',
                    height:     args.creative.megaboard.height + 'px',
                    //position:   'fixed',
                    float:      'left',
                    outline:    'none'
                },
                branding__bb4: {
                    width:      bb_WidthR + 'px',
                    height:     args.tools.height + 'px',
                    position:   'absolute',
                    top:        0,
                    left:       '-' + bb_WidthR + 'px'
                },
                branding__bb5: {
                    width:      '100%',
                    height:     args.tools.height + 'px',
                    //background: '#fff',
                    position:   'absolute',
                    top:        0, // '-61px'
                    padding:    '3px 0 0;'
                },
                branding__bb6: {
                    width:      bb_WidthR + 'px',
                    height:     args.tools.height + 'px',
                    //position:   'fixed',
                    float:      'left',
                    outline:    'none'
                },
                branding__bb7: {
                    //width:      bb_tempWidth +'px',
                    width:      '360px',
                    height:     args.tools.height + 'px',
                    position:   'absolute',
                    top:        0,
                    //left:       args.page_width + 'px'
                    right:      '-360px'
                },
                branding__bb8: {
                },
                branding__bb9: {
                    width:      bb_tempWidth + 'px',
                    height:     args.tools.height + 'px',
                    //position:   'fixed',
                    float:      'left',
                    outline:    'none'
                }
            };

            if(is_gallery)
            {
                // custom gallery styles, allow overriding
                cssObject = BD_Extend({}, cssObject, {

                });
            }
            
            var css = BD_GenerateCSS(cssObject);
            if(args.dev) {
                console.log(css);    
            }
            
            var html = ""
                + "<div class='promotion__branding branding__" + args.type + "'>"
                + "<div class='promotion__badge'><span>" + args.tools.pr_word + "</span></div>"/* + args.html + */
                + "<a class='branding__bb3' href='" + args.ad_server.click_url + "' target='_blank'></a>"
                + "<div class='branding__bb4'>"
                + "<div class='branding__bb5'>"
                + "<a class='branding__bb6' href='" + args.ad_server.click_url + "' target='_blank'></a>"
                + "</div>"
                + "</div>"
                + "<div class='branding__bb7 branding__right'>"
                + "<div class='branding__bb8'>"
                + "<a class='branding__bb9 branding__right' href='" + args.ad_server.click_url + "' target='_blank'></a>"
                + "</div>"
                + "</div>"
                + "</div>";

            // print it!
            document.write('<!-- start BurdaDigital BB --><style>'+css+'</style>'+html+'<!-- end BurdaDigital BB -->');

            // tracking
            if(args.pixel)
            {
                var _pxSpy = new Image (1,1);
                _pxSpy.src = args.pixel;
            }
        }

        // onresize actions
        window.addEventListener('resize', function()
        {
            if(args.dev){
                console.log('window has been resized');    
            }
        });

        // do after DOM
        document.addEventListener("DOMContentLoaded", function(e)
        {
            // if branding have bigger height than body
            if(body.height < args.tools.height)
            {
                body.style.height = (args.tools.height + 50) + 'px';
            }

            // if is admin logged
            if(body.classList.contains(args.tools.class_toolbar))
            {
                body.style.backgroundPosition = 'center ' + ( args.tools.pr_height + args.tools.drupal_toolbar_height ) + 'px';
            }
        });
    }
}