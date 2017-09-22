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
 * allowed to add suffix px
 * @param key
 * @param value
 * @returns {string}
 * @constructor
 */
function BD_Incs(key, value)
{
    var i = ['height', 'width', 'left', 'right', 'top', 'bottom'].indexOf(key);
    var a = ['auto!important', 'auto', 'important'].indexOf(value);

    return i >= 0 && a < 0 ? 'px' : '';
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
        // create new class or media query
        css += (cName.indexOf('@') >= 0 ? '' : '.') + cName + '{';

        for(cProperty in cssObject[cName])
        {
            // class properties or nested media query
            if("0" == cProperty)
            {
                css += BD_GenerateCSS(cssObject[cName][cProperty]);
            }
            else
            {
                // for classes like: 'font-size' we must using 'font_size' in object and replacing it here
                var property = cProperty.replace('_', '-');

                // create option row
                css += property + ':' + cssObject[cName][cProperty] + BD_Incs(property, cssObject[cName][cProperty]) + ';';
            }
        }

        // end of class or media query
        css += '}';
    }

    return css;
}

/**
 * Custom feature for prepend html before
 * @param element
 */
HTMLElement.prototype.prependHtml = function (element) {
    const div = document.createElement('div');
    div.innerHTML = element;
    this.insertBefore(div, this.firstChild);
};

/**
 * Custom feature for append html after
 * @param element
 */
HTMLElement.prototype.appendHtml = function (element) {
    const div = document.createElement('div');
    div.innerHTML = element;
    while (div.children.length > 0) {
        this.appendChild(div.children[0]);
    }
};

/**
 * Create branding factory
 * @param myOptions object
 */
function BD_CreateBranding(myOptions)
{
    // default states
    var is_front_page   = false;
    var is_gallery      = false;
    var pseudo_sides    = true;

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
                file_mobile:        '',
                width:              1000,
                height:             120,
                his_class:          'promotion__megaboard',
                html:               '',
                html_mobile:        ''
            },
            background_color:       '',
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
            // see: http://help.billboard.cz/xwiki/bin/view/AdServer+v2/PlaceHolderList
            url:                    '',
            click_url:              '',
            click_url_encoded:      '',
            cd_ad_domain:           '',
            ban_updatecnt:          '',
            id_banner:              '',
            id_kampan:              '',
            pbt_used:               '',
            banner_name:            '',
            campaign_name:          '',
            viewable_track_url:     ''

        },
        page_width:                 980, // @todo: think about dynamic looking
        page_responsive_from:       980,
        element_class:              'branding_wrapper',
        tpl_shared:                 true,
        dev:                        false,
        css:                        '',
        html:                       ''
    };

    // merge objects
    var args = BD_Extend({}, defaultOptions, myOptions);

    if(args.dev) {
        console.log(args);
    }

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
    else
    {
        // pretty var
        element = element[0];
    }

    if(args.dev) {
        console.info('our main element:');
        console.info(element);
    }


    var elementBackground = function()
    {
        // set wrapper background
        if(args.creative.background_color){
            //element.style.backgroundColor = args.creative.background_color;
        }

        if(element.style.background){
            //element.style.background = 'url("'+ args.ad_server.url + args.creative.first.file +'")';
        }


        element.style.background =
            (args.creative.background_color ? args.creative.background_color : '')
            + ' url("'+ args.ad_server.url + args.creative.first.file +'") '
            + (args.creative.background_options ? args.creative.background_options : '');
        /**/
    };

    var megaBoardTpl = function()
    {
        if('' !== args.creative.megaboard.file || '' !== args.creative.megaboard.file_mobile)
        {
            /**
             * check file extension
             */
            var ext = function(filename)
            {
                var e = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
                if(args.dev){
                    console.info('extension:' + e);
                }

                return e;
            };

            var out="<div class='branding__megaboard'>";

            if('html' == ext(args.creative.megaboard.file))
            {
                out+=""
                    + "<iframe"
                    + " src='" + args.ad_server.url + args.creative.megaboard.file + "?redir=" + args.ad_server.click_url_encoded + "&bbtarget=_blank'"
                    + " width='" + args.creative.megaboard.width + "'"
                    + " height='" + args.creative.megaboard.height + "'"
                    + " scrolling='no'"
                    + " seamless>"
                    + "</iframe>";
            }

            if('' !== args.creative.megaboard.file && 'jpg' == ext(args.creative.megaboard.file))
            {
                out+="<a class='branding__bb3' href='" + args.ad_server.click_url + "' target='_blank'>";
                out+=""
                    + "<img"
                    + " class='megaboard__desktop'"
                    + " src='" + args.ad_server.url + args.creative.megaboard.file + "?redir=" + args.ad_server.click_url_encoded + "&bbtarget=_blank'"
                    + " width='" + args.creative.megaboard.width + "'"
                    + " height='" + args.creative.megaboard.height + "'"
                    + " border='0'"
                    + ">";
                out+="</a>";
            }

            if('' !== args.creative.megaboard.file_mobile && 'jpg' == ext(args.creative.megaboard.file_mobile))
            {
                out+=""
                    + "<a class='branding__bb3' href='" + args.ad_server.click_url + "' target='_blank'>"
                    + "<img "
                    + " class='megaboard__mobile'"
                    + " src='" + args.ad_server.url + args.creative.megaboard.file_mobile + "?redir=" + args.ad_server.click_url_encoded + "&bbtarget=_blank'"
                    + " border='0'"
                    + ">"
                    + "</a>";
            }

            out+="</div>";

        }
        else
        {
            return "<a class='branding__bb3' href='" + args.ad_server.click_url + "' target='_blank'></a>";
        }

        return out;
    };

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

            args.html+=""
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

            args.tpl_shared = false;

            // dev
            if('' == args.creative.first.file){
                if(args.dev){
                    console.warn('First creative missing!');
                }
            }
            if('' == args.creative.second.file){
                if(args.dev){
                    console.warn('Second creative missing!');
                }
            }

            // setup
            window.BD_opts = {
                impressionTrackingUrl:  args.pixel,
                firstImageUrl:          args.ad_server.url + args.creative.first.file,
                secondImageUrl:         args.ad_server.url + args.creative.second.file,
                clickUrl:               args.ad_server.click_url,
                element:                element,
                position:               'absolute',
                background: {
                    position:           'center top',
                    attachment:         'inherit',
                    size:               'auto',
                    repeat:             'no-repeat'
                },
                transition:             'width 0.2s ease-out'
            };

            // original, just tracking and print external bbelements libs
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
                options: window.BD_opts,
                script : 'https://www.marianne.cz/themes/custom/marianne/js/brand/views/background-double-layer-script-1.01.js',
                //script : args.ad_server.cd_ad_domain + '/bb/creativelib/ad-scripts/background-double-layer/background-double-layer-script-1.01.js',
                library: args.ad_server.cd_ad_domain + '/bb/creativelib/creative-lib-1.02.32.min.js'
            }));

            // fix cursor
            document.body.style.cursor = 'inherit';

            break;

        default:

            if(args.dev) {
                console.warn('This is type is not allowed!');
            }
    }

    if(typeof(element) != 'undefined' && element != null)
    {
        // calculating
        var bb_WidthR       = ((args.creative.first.width - args.page_width) / 2);
        var bb_mRight       = bb_WidthR + args.page_width;
        var bb_tempWidth    = (( window.innerWidth - args.page_width) / 2) - 15;
        bb_tempWidth        = bb_tempWidth > bb_WidthR ? bb_WidthR : bb_tempWidth;

        // apply background
        element.classList.add(args.tools.class_active);

        // default styles
        var cssObject = {
            promotion__megaboard: {
                display:    'none'
            },
            promotion__branding: {
                width:      args.page_width,
                height:     + args.creative.megaboard.height,
                position:   'relative',
                margin:     '0 auto'
            },
            branding__bb3: {
                width:      args.page_width,
                height:     args.creative.megaboard.height,
                display:    'block',
                //position:   'fixed',
                //float:      'left',
                outline:    'none'
            },
            branding__bb4: {
                width:      bb_WidthR,
                height:     args.tools.height,
                position:   'absolute',
                top:        0,
                left:       '-' + bb_WidthR
            },
            branding__bb5: {
                width:      '100%',
                height:     args.tools.height,
                //background: '#fff',
                position:   'absolute',
                top:        0, // '-61px'
                padding:    '3px 0 0;'
            },
            branding__bb6: {
                width:      bb_WidthR,
                height:     args.tools.height,
                //position:   'fixed',
                float:      'left',
                outline:    'none'
            },
            branding__bb7: {
                //width:      bb_tempWidth +'px',
                width:      '360',
                height:     args.tools.height,
                position:   'absolute',
                top:        0,
                //left:       args.page_width
                right:      '-360'
            },
            branding__bb8: {
            },
            branding__bb9: {
                width:      bb_tempWidth,
                height:     args.tools.height,
                //position:   'fixed',
                float:      'left',
                outline:    'none'
            },
            megaboard__mobile: {
                display:    'none'
            },
            '@media(max-width: 990px)': [{

                    branding_wrapper: {
                        display:    'none'
                    },
                    megaboard__mobile: {
                        display:    'block',
                        height:     'auto!important'
                    },
                    promotion__branding: {
                        height:     'auto'
                    },
                    branding__bb3: {
                        height:     'auto'
                    }
            }]
        };

        // set height for main wrapper element
        cssObject[args.element_class] = {
            height: args.tools.height
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

        // Start HTML
        var html = ""
            + "<div class='promotion__branding branding__" + args.type + "'>"
            + "<div class='promotion__badge'><span>" + args.tools.pr_word + "</span></div>";

        // Megaboard
        html+=megaBoardTpl();

        if(pseudo_sides)
        {
            // Pseudo-branding
            html+=""
                + "<div class='branding__bb4'>"
                + "<div class='branding__bb5'>"
                + "<a class='branding__bb6' href='" + args.ad_server.click_url + "' target='_blank'></a>"
                + "</div>"
                + "</div>"
                + "<div class='branding__bb7 branding__right'>"
                + "<div class='branding__bb8'>"
                + "<a class='branding__bb9 branding__right' href='" + args.ad_server.click_url + "' target='_blank'></a>"
                + "</div>"
                + "</div>";
        }

        html+="</div>";

        // set wrapper background
        elementBackground();

        // print it!
        document.write('<!-- start BurdaDigital BB --><style>'+css+'</style>'+html+'<!-- end BurdaDigital BB -->');


        if(args.tpl_shared)
        {
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

            if(element.offsetHeight < body.offsetHeight)
            {
                element.style.height = body.offsetHeight + 'px';
            }
        });

        // do after DOM
        document.addEventListener("DOMContentLoaded", function(e)
        {
            // if branding have bigger height than body
            if(body.offsetHeight < args.tools.height)
            {
                body.style.height = (args.tools.height + 50) + 'px';
            }

            // if is admin logged
            if(body.classList.contains(args.tools.class_toolbar))
            {
                body.style.backgroundPosition = 'center ' + ( args.tools.pr_height + args.tools.drupal_toolbar_height ) + 'px';
            }

            // make element same height as body
            if(element.offsetHeight < body.offsetHeight)
            {
                element.style.height = body.offsetHeight + 'px';
            }
        });


    }
    else
    {
        if(args.dev){
            console.warn("Used element not exist!");
        }
    }
}