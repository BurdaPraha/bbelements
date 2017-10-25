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


window.BD_Branding = function() {};
window.BD_Branding.prototype = {

    /**
     * Create branding factory
     * @param myOptions object
     * @constructor
     */
    create: function (myOptions)
    {
        // init defaults
        this.is_front_page   = false;
        this.is_gallery      = false;
        this.pseudo_sides    = true;
        this.dev             = false;
        this.args            = {};
        this.html            = '';
        this.css             = '';

        // merge objects
        this.setupArgs(myOptions);

        // is it gallery page or ... ?
        this.checkPageType();

        // branding types init
        this.setupTypes();

        // get main wrapper
        this.getWrapper();

        if(typeof(this.element) != 'undefined' && this.element != null)
        {
            // marketing tracking pixel
            this.createTrackingPixel();

            this.css = this.generateCSS(this.cssDefault(), true);

            // create layout
            this.tplLayout();

            // print it!
            this.printer('<!-- start BurdaDigital BB --><style>'+this.css+'</style>'+this.html+'<!-- end BurdaDigital BB -->');
        }
        else{
            if(this.isDev){console.warn("Used element not exist!");}
        }

        // start events handlers
        this.listeners();
    },


    tplLayout: function()
    {
        this.html = "<div class='promotion__branding branding__" + this.args.type + "'>";

        if('' !== this.args.tools.pr_word){
            this.html+="<div class='promotion__badge'><span>" + this.args.tools.pr_word + "</span></div>";
        }

        this.html+=this.tplMegaBoard();

        if(this.args.pseudo_sides) {
            this.html+=this.tplPseudoSides();
        }

        this.html+="</div>";
    },


    /**
     * Setup our core arguments
     * @param options object
     */
    setupArgs: function(options)
    {
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
            pixel:                      [],
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

        this.args = this.mergeObject({}, defaultOptions, options);

        if(this.isDev){
            console.info('args:', this.args); // print all args
        }
    },


    /**
     *
     * @param args
     */
    setupTypes: function(args)
    {
        var t = this;
        
        // allowed with superpowers
        switch(t.args.type)
        {
            // without action
            case 'anicka':
                t.args.creative.background_options = 'no-repeat center ' + t.args.tools.pr_height + 'px';
                break;

            // fixed bg
            case 'maruska':
                t.args.creative.background_options = 'no-repeat center ' + t.args.tools.pr_height + 'px'; //fixed
                break;

            // auto replicated
            case 'zuzanka':
                t.args.creative.background_options = 'repeat-y center ' + t.args.tools.pr_height + 'px';
                break;

            // with HTML banner to header
            case 'amalka':

                // check if valid
                if('' == t.args.creative.megaboard.file || t.args.creative.megaboard.file.indexOf('.html') !== -1){if(t.isDev){console.warn('Please fill in creative.megaboard item file');}}
                break;

            // strip - not working right now, @todo!
            case 'rozarka':

                t.args.tpl_shared = false;

                // valid
                if('' == t.args.creative.first.file && t.isDev){console.warn('First creative missing!');}
                if('' == t.args.creative.second.file && t.isDev){console.warn('Second creative missing!');}

                // setup
                t.backgroundDoubleLayerLibrary(args);

                // fix cursor
                document.body.style.cursor = 'inherit';
                break;

            default:

                if(t.isDev){console.warn('This is type is not allowed!');}
                break;
        }
    },


    /**
     * Possible in future useful for some difference between page types
     */
    checkPageType: function()
    {
        var page = document.getElementById(this.args.tools.element_id);

        if(!page){
            if(this.isDev){console.warn("element #" + this.args.tools.element_id + " not exists!");}
        }
        else
        {
            this.is_front_page = page.classList.contains(this.args.tools.class_front_page);
            this.is_gallery    = page.classList.contains(this.args.tools.class_gallery);
        }

        // zero padding
        if(this.is_gallery){
            this.args.tools.pr_height = 0;
        }

        // vyska odsazeni webu
        //args.creative.megaboard.height += args.tools.pr_height;
    },


    /**
     * Necessary wrapper for strip branding
     */
    getWrapper: function()
    {
        this.element = document.getElementsByClassName(this.args.element_class);

        if(0 == this.element.length)
        {
            this.element = document.body; // element fallback

            if(this.isDev){
                console.warn('Not found wrapper for branding with class: ' + this.args.element_class + '. Using fallback to <body>.');
            }

        } else {
            this.element = this.element[0]; // pretty var
        }

        if(this.isDev){
            console.info('our main element:', this.element);
        }

        // apply background
        this.elementAddBg(this.element, this.args.creative.background_color, this.args.creative.first.file, this.args.creative.background_options);
        this.element.classList.add(this.args.tools.class_active);
    },


    /**
     * Factory for inline bg
     * @param el
     * @param color
     * @param url
     * @param options
     */
    elementAddBg: function (el, color, url, options)
    {
        el.style.background = (color ? color : '')
        + ' url("'+ this.args.ad_server.url + url +'") '
        + (options ? options : '');
    },


    /**
     * Merge deep objects
     * Credit: http://stackoverflow.com/a/20591261/3783469
     * @param target
     * @returns {*}
     */
    mergeObject: function (target)
    {
        for(var i=1; i<arguments.length; ++i) {
            var from = arguments[i];
            if(typeof from !== 'object') continue;
            for(var j in from) {
                if(from.hasOwnProperty(j)) {
                    target[j] = typeof from[j]==='object'
                        ? this.mergeObject({}, target[j], from[j])
                        : from[j];
                }
            }
        }

        return target;
    },


    /**
     * allowed to add suffix px
     * @param key
     * @param value
     * @returns {string}
     */
    incs: function (key, value)
    {
        var i = ['height', 'width', 'left', 'right', 'top', 'bottom'].indexOf(key);
        var a = ['auto!important', 'auto', 'important'].indexOf(value);


        return i >= 0 && a < 0 ? 'px' : '';
    },


    /**
     * Factory for create CSS from object, todo: Object.keys(cssObject).reduce(fn, default), todo: media query, todo: think about storing to local storage, caching with some checksum
     * @param cssObject
     * @returns {string}
     */
    generateCSS: function (cssObject, close)
    {
        /**
         *
         * @param i
         * @returns {*}
         */
        var start = function(i)
        {
            // nothing before these
            if (i.indexOf('@') >= 0 || i.indexOf('<') >= 0 || 'iframe' === i){
                return '';
            }

            if (i.indexOf('#') >= 0){
                return '#';
            }

            // class by default
            return '.';
        };


        var isMediaQuery = function(i){
            return i.indexOf('@') >= 0;
        };

        var css = '';
        for (var cName in cssObject)
        {
            // create new class or media query
            var c = 0;

            for(var cProperty in cssObject[cName])
            {
                // class properties or nested media query
                if("0" == cProperty)
                {
                    var _close = true;

                    // open it only for first time
                    if(true == isMediaQuery && c == 0){
                        css += start(cName) + cName + '{';
                    }
                    else
                    {
                        // nested CSS like: .someclass .nextclass {}
                        css += start(cName) + cName + ' ';
                        _close = false;
                    }

                    // elements
                    css += this.generateCSS(cssObject[cName][cProperty], _close);
                }
                else
                {
                    if(c == 0){
                        css += start(cName) + cName + '{';
                    }

                    // for classes like: 'font-size' we must using 'font_size' in object and replacing it here
                    var property = cProperty.replace('_', '-');

                    // create option row
                    css += property + ':' + cssObject[cName][cProperty] + this.incs(property, cssObject[cName][cProperty]) + ';';
                }

                c++;
            }

            // end of class or media query
            if(close){
                css += '}';
            }
        }

        if(this.isDev){
            console.info('all styles:', css);
        }


        return css;
    },


    listeners: function()
    {
        window.addEventListener('resize', function()
        {
            if(this.isDev){
                console.info('window has been resized');
            }

            if(this.element.offsetHeight < document.body.offsetHeight){
                this.element.style.height = document.body.offsetHeight + 'px';
            }
        });

        document.addEventListener("DOMContentLoaded", function(e)
        {
            // if branding have bigger height than body
            if(document.body.offsetHeight < this.args.tools.height){
                document.body.style.height = (this.args.tools.height + 50) + 'px';
            }

            // if is admin logged
            if(document.body.classList.contains(this.args.tools.class_toolbar)){
                document.body.style.backgroundPosition = 'center ' + ( this.args.tools.pr_height + this.args.tools.drupal_toolbar_height ) + 'px';
            }

            // make element same height as body
            if(this.element.offsetHeight < document.body.offsetHeight){
                this.element.style.height = document.body.offsetHeight + 'px';
            }
        });
    },


    /**
     * template for megaboard
     * @returns {string}
     */
    tplMegaBoard: function()
    {
        var t = this;

        if('' !== t.args.creative.megaboard.file || '' !== t.args.creative.megaboard.file_mobile)
        {
            var out="<div class='branding__megaboard'>";

            if('html' == t.ext(t.args.creative.megaboard.file))
            {
                out+=""
                    + "<iframe"
                    + " src='" + t.args.ad_server.url + t.args.creative.megaboard.file + "?redir=" + t.args.ad_server.click_url_encoded + "&bbtarget=_blank'"
                    + " width='" + t.args.creative.megaboard.width + "'"
                    + " height='" + t.args.creative.megaboard.height + "'"
                    + " scrolling='no'"
                    + " seamless>"
                    + "</iframe>";
            }

            if('jpg' == t.ext(t.args.creative.megaboard.file) && '' !== t.args.creative.megaboard.file)
            {
                out+="<a class='branding__bb3' href='" + t.args.ad_server.click_url + "' target='_blank'>";
                out+=""
                    + "<img"
                    + " class='megaboard__desktop'"
                    + " src='" + t.args.ad_server.url + t.args.creative.megaboard.file + "?redir=" + t.args.ad_server.click_url_encoded + "&bbtarget=_blank'"
                    + " width='" + t.args.creative.megaboard.width + "'"
                    + " height='" + t.args.creative.megaboard.height + "'"
                    + " border='0'"
                    + ">";
                out+="</a>";
            }

            if('jpg' == t.ext(t.args.creative.megaboard.file_mobile) && '' !== t.args.creative.megaboard.file_mobile)
            {
                out+=""
                    + "<a class='branding__bb3' href='" + t.args.ad_server.click_url + "' target='_blank'>"
                    + "<img"
                    + " class='megaboard__mobile'"
                    + " src='" + t.args.ad_server.url + t.args.creative.megaboard.file_mobile + "?redir=" + t.args.ad_server.click_url_encoded + "&bbtarget=_blank'"
                    + " border='0'"
                    + ">"
                    + "</a>";
            }

            out+="</div>";
        }
        else
        {
            if(t.isDev){console.warn("There isn't any megaboard creative file");}
            return "<a class='branding__bb3' href='" + t.args.ad_server.click_url + "' target='_blank'></a>";
        }


        return out;
    },


    /**
     * template for ad sidebars
     * @returns {string}
     */
    tplPseudoSides: function()
    {
        return ""
            + "<div class='branding__bb4'>"
            + "<div class='branding__bb5'>"
            + "<a class='branding__bb6' href='" + this.args.ad_server.click_url + "' target='_blank'></a>"
            + "</div>"
            + "</div>"
            + "<div class='branding__bb7 branding__right'>"
            + "<div class='branding__bb8'>"
            + "<a class='branding__bb9 branding__right' href='" + this.args.ad_server.click_url + "' target='_blank'></a>"
            + "</div>"
            + "</div>";
    },


    /**
     * CSS for templates
     * @returns {object}
     */
    cssDefault: function()
    {
        // calculating
        var bb_WidthR       = ((this.args.creative.first.width - this.args.page_width) / 2);
        var bb_mRight       = bb_WidthR + this.args.page_width;
        var bb_tempWidth    = (( window.innerWidth - this.args.page_width) / 2) - 15;
        bb_tempWidth        = bb_tempWidth > bb_WidthR ? bb_WidthR : bb_tempWidth;

        // default styles
        var style = {
            promotion__megaboard: {
                display:    'none'
            },
            promotion__branding: {
                width:      this.args.page_width,
                height:     + this.args.creative.megaboard.height,
                position:   'relative',
                margin:     '0 auto'
            },
            branding__bb3: {
                width:      this.args.page_width,
                height:     this.args.creative.megaboard.height,
                display:    'block',
                //position:   'fixed',
                //float:      'left',
                outline:    'none'
            },
            branding__bb4: {
                width:      bb_WidthR,
                height:     this.args.tools.height,
                position:   'absolute',
                top:        0,
                left:       '-' + bb_WidthR
            },
            branding__bb5: {
                width:      '100%',
                height:     this.args.tools.height,
                //background: '#fff',
                position:   'absolute',
                top:        0, // '-61px'
                padding:    '3px 0 0;'
            },
            branding__bb6: {
                width:      bb_WidthR,
                height:     this.args.tools.height,
                //position:   'fixed',
                float:      'left',
                outline:    'none'
            },
            branding__bb7: {
                //width:      bb_tempWidth +'px',
                width:      '360',
                height:     this.args.tools.height,
                position:   'absolute',
                top:        0,
                //left:       this.args.page_width
                right:      '-360'
            },
            branding__bb8: {
            },
            branding__bb9: {
                width:      bb_tempWidth,
                height:     this.args.tools.height,
                //position:   'fixed',
                float:      'left',
                outline:    'none'
            },
            megaboard__mobile: {
                display:    'none'
            },
            branding__megaboard: [{

                '< iframe': {
                    margin:     0,
                    border:     0
                }

            }],
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
        style[this.args.element_class] = {
            height: this.args.tools.height
        };


        return style;
    },


    /**
     * create tracking pixel and append as element to <body>
     */
    createTrackingPixel: function ()
    {
        var t = this;

        var print = function(src){
            var p = new Image (1,1);
            p.src = src;
            document.body.appendChild(p);
        };

        if(t.args.tpl_shared && t.args.pixel)
        {
            /** pixel can be in array - for example because we need our develop pixel too */
            if(typeof t.args.pixel == 'object' && null !== t.args.pixel)
            {
                var pixels = Object.keys(t.args.pixel).length;
                for (var i=0; i < pixels; i++) {
                    print(t.args.pixel[i]);
                }
            }
            else
            {
                /** simple string */
                if(''!== t.args.pixel) {
                    print(t.args.pixel);
                }
            }
        }
    },


    /**
     * check file extension
     * @param filename string
     */
    ext: function(filename)
    {
        var e = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        if(this.isDev && '' !== filename){
            console.info('extension:' + e);
        }


        return e;
    },


    /**
     * document.write() alternative
     * see: https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript
     * @param html
     */
    printer: function(html)
    {
        var isIE = this.detectIE();
        
        if(false == isIE || isIE >= 12)
        {
            document.currentScript.insertAdjacentHTML('beforebegin', html);
        }
        else {
            document.write(html);
        }
    },


    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
     */
    detectIE: function ()
    {
        var ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …

        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

        // Edge 12 (Spartan)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

        // Edge 13
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    },


    /**
     * Originally bbelements script with custom about <header> padding
     * check file extension
     */
    backgroundDoubleLayerLibrary: function()
    {
        var t = this;

        // original
        (function(args) {
            try{var o=[].concat(t.args.options.impressionTrackingUrl),i,n;i=o.length;
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
            options: {
                impressionTrackingUrl:  t.args.pixel,
                firstImageUrl:          t.args.ad_server.url + t.args.creative.first.file,
                secondImageUrl:         t.args.ad_server.url + t.args.creative.second.file,
                clickUrl:               t.args.ad_server.click_url,
                element:                t.element,
                position:               'absolute',
                background: {
                    position:           'center top',
                    attachment:         'inherit',
                    size:               'auto',
                    repeat:             'no-repeat'
                },
                transition:             'width 0.2s ease-out'
            },
            script : 'https://www.marianne.cz/themes/custom/marianne/js/brand/views/background-double-layer-script-1.01.js', // todo - modificated !!!
            //script : this.args.ad_server.cd_ad_domain + '/bb/creativelib/ad-scripts/background-double-layer/background-double-layer-script-1.01.js',
            library: t.args.ad_server.cd_ad_domain + '/bb/creativelib/creative-lib-1.02.32.min.js'
        }));
    },


    /********* GETTERS *********/


    /**
     * getter
     * @returns {*}
     */
    isDev: function(){
        return this.args.dev;
    },


    /**
     * getter
     * @returns {{}|*}
     */
    getArgs: function(){
        return this.args;
    }
};