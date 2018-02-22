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
        this.is_gallery      = false;
        this.element         = null;
        this.scroll          = {last_know_position: 0, direction: '?'};
        this.dev             = false;
        this.args            = {};
        this.html            = '';
        this.css             = '';

        // merge objects
        this.setupArgs(myOptions);

        // is it gallery page or ... ?
        this.checkPageType();

        // get main wrapper
        this.getWrapper();

        // branding types init
        this.setupTypes();

        if(typeof(this.element) != 'undefined' && this.element != null)
        {
            // marketing tracking pixel
            this.createTrackingPixel();

            this.css = this.generateCSS(this.cssDefault(), true, this.getArgs());

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
        var t = this;

        t.html = "<div class='" + t.args.cssPrefixBEM + "'>";

        if('' !== t.args.tools.pr_word){
            t.html+="<div class='" + t.composeBEM('badge') + "'><span>" + t.args.tools.pr_word + "</span></div>";
        }

        t.html+=t.tplMegaBoard();
        t.html+="</div>";
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
                    his_class:          'megaboard',
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
                fixed_elements_before:  ['[data-branding-fixed]'],
                element_id:             'page',
                class_front_page:       'front-page',
                class_gallery:          'gallery',
                class_active:           'active',
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
            page_width:                 1000, // @todo: think about dynamic looking
            page_responsive_from:       980,
            element_class:              'branding_wrapper',
            tpl_shared:                 true,
            dev:                        false,
            css:                        '',
            cssPrefixBEM:               'branding', // note: must be declared in defaultCSS !
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
                t.scrollFixer();
                t.args.creative.background_options = 'no-repeat top center'; //fixed ' + t.args.tools.pr_height + 'px'
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
     * We calculate document and window height on each scroll event to account for dynamic DOM changes.
     */
    scrollFixer: function()
    {
        var t           = this;
        var offset    = t.element.offsetTop;

        (function()
        {
            var supportOffset   = window.pageYOffset !== undefined;
            var ticking         = false;

            window.addEventListener('wheel', function(e)
            {
                var currYPos                = supportOffset ? window.pageYOffset : document.body.scrollTop;
                t.scroll.last_know_position = currYPos;
                t.scroll.direction          = t.scroll.last_know_position > currYPos ? 'up' : 'down';
                var before                  = t.heightOfFixedElements();

                if (!ticking)
                {
                    window.requestAnimationFrame(function() // todo: check cross-browser support
                    {
                        ticking = false;

                        if(t.scroll.last_know_position >= offset - before)
                        {
                            // make it floating now!
                            t.element.style.position    = 'fixed';
                            t.element.style.top         = before + 'px';


                        }
                        else
                        {
                            // reset
                            t.element.style.position    = 'absolute';
                            t.element.style.top         = 'inherit';
                        }

                    });
                }

                ticking = true;

            });

        })();
    },


    /**
     * get height of fixed elements before branding - like floating header / menu etc and calculate theirs height
     * @returns {number}
     */
    heightOfFixedElements: function()
    {
        var el      = this.args.tools.fixed_elements_before;
        var height  = 0;

        if(typeof el == 'object' && null !== el)
        {
            var count = Object.keys(el).length;
            for(var i = 0; i < count; ++i)
            {
                var search  = document.querySelectorAll(el[i]);
                for(var result = 0; result > search; ++result)
                {
                    var each    = search[result];
                    var eHeight = each.offsetHeight;

                    if(eHeight > 0){
                        height = height + eHeight;
                    }
                }
            }
        }


        return height;
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
            this.is_gallery = page.classList.contains(this.args.tools.class_gallery);
        }

        // zero padding - todo: check this
        if(this.is_gallery){
            this.args.tools.pr_height = 0;
        }
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

        // add classes for <body>
        var bcl = document.body.classList;

        bcl.add(this.composeBEM(this.args.tools.class_active));
        bcl.add(this.composeBEM('type--' + this.args.type));

        // apply background
        this.elementAddBg(this.element, this.args.creative.background_color, this.args.creative.first.file, this.args.creative.background_options);
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
            + ' url("'+ this.args.ad_server.url + url +'") no-repeat top center';
            //+ (options ? options : '');
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
        var resume_key      = null;
        var resume_val      = null;
        var def_property    = ['height', 'width', 'left', 'right', 'top', 'bottom', 'z-index', 'opacity'];
        var def_value       = ['auto', '!important', '%', 'rem', 'em', 'inherit', 'initial', 'unset', 'px', 'z-index'];

        for(var i1 = 0; i1 < def_property.length; ++i1)
        {
            resume_key = key.search(def_property[i1]);
            if(resume_key >= 0){
                break;
            }
        }

        for(var i2 = 0; i2 < def_value.length; ++i2)
        {
            resume_val = value.toString().search(def_value[i2]);
            if(resume_val >= 0){
                break;
            }
        }


        return resume_key >= 0 && resume_val < 0 ? 'px' : '';
    },


    /**
     * Factory for create CSS from object, todo: Object.keys(cssObject).reduce(fn, default), todo: media query, todo: think about storing to local storage, caching with some checksum
     * @param cssObject
     * @param close
     * @param variables
     * @returns {string}
     */
    generateCSS: function (cssObject, close, variables)
    {
        var t = this;

        var isMediaQuery = function(i){
            return i.indexOf('@') >= 0;
        };

        var isVariable = function(i){
            return i.indexOf('$') >= 0;
        };

        var isChained = function(i){
            return i.indexOf('>') >= 0;
        };

        var isId = function(i){
            return i.indexOf('#') >= 0;
        };

        var start = function(i)
        {
            var p = '.'; // by default is all class

            if (isMediaQuery(i) || isChained(i) || isVariable(i) || 'iframe' === i){
                p = '';
            }

            if (isId(i)){
                p = '#';
            }

            if(isVariable(i)) {
                i = i.replace('$', '');
                i = variables[i];
            }


            return p + i;
        };

        var css = '';
        for (var cName in cssObject)
        {
            // create new class or media query
            var c = 0;
            for(var cProperty in cssObject[cName])
            {
                // this is empty object :(
                if(0 == Object.keys(cssObject[cName]).length){
                    continue;
                }

                // class properties or nested media query
                if("0" == cProperty)
                {
                    var _close = true;

                    // open it only for first time
                    if(true == isMediaQuery(cName) && 0 == c){
                        css += start(cName) + '{';
                    }
                    else
                    {
                        // nested CSS like: .someclass .nextclass {}
                        css += start(cName) + ' ';
                        _close = false;
                    }

                    // elements
                    css += t.generateCSS(cssObject[cName][cProperty], _close, variables);
                }
                else
                {
                    if(c == 0){
                        css += start(cName) + '{';
                    }

                    // for classes like: 'font-size' we must using 'font_size' in object and replacing it here
                    var property = cProperty.replace('_', '-');

                    // create option row
                    css += property + ':' + cssObject[cName][cProperty] + t.incs(property, cssObject[cName][cProperty]) + ';';
                }

                c++;
            }

            // end of class or media query
            if(close){
                css += '}';
            }
        }

        if(t.isDev){
            console.info('all styles:', css);
        }


        return css;
    },


    listeners: function()
    {
        /** we are already in DOM ready... */

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
    },


    /**
     * template for megaboard
     * @returns {string}
     */
    tplMegaBoard: function()
    {
        var t = this;
        var out = '';

        if('' !== t.args.creative.megaboard.file || '' !== t.args.creative.megaboard.file_mobile)
        {
            out+="<div class='" + t.composeBEM('megaboard') + "'>";

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
                out+="<a href='" + t.args.ad_server.click_url + "' target='_blank'>";
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
                    + "<a href='" + t.args.ad_server.click_url + "' target='_blank'>"
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
            out+="<a href='" + t.args.ad_server.click_url + "' target='_blank'></a>";
        }

        out+="" +
            "<div class='" + this.composeBEM('area') + "'>" +
                "<a class='" + this.composeBEM('area-a') + "' href='" + this.args.ad_server.click_url + "' target='_blank'></a>" +
            "</div>";        
        

        return out;
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
            'branding': {   // todo: think how inject $cssPrefixBEM as variable
                width:      this.args.page_width,
                height:     this.args.creative.megaboard.height,
                margin:     '0 auto',
                position:   'relative',
                'z-index':  0
            },
            branding__area: {
                width:      '100%'
            },
            'branding__area-a': {
                width:      '100%',
                height:     this.args.tools.height,
                position:   'fixed',
                top:        0,
                left:       0,
                outline:    'none'
            },
            megaboard__mobile: {
                display:    'none'
            },
            branding__badge: {
                width:          '100%',
                height:         '17px',
                position:       'absolute',
                display:        'block',
                padding:        0,
                'margin-top':   0,
                'text-align':   'right',
                'background':   'transparent'
            },
            'branding__badge span': {
                'padding':          '2px 10px',
                'vertical-align':   'top',
                'background':       '#fff',
                'font-size':        '10px',
                'text-transform':    'uppercase',
                'color':             '#878787',
                'font-family':       '"Arial",sans-serif'
            },
            branding__megaboard: [{
                '> iframe': {
                    margin:     0,
                    border:     0
                }
            }],
            'branding__megaboard a': {
                width:      this.args.page_width,
                height:     this.args.creative.megaboard.height,
                display:    'block',
                outline:    'none'
            },
            '@media(max-width: 990px)': [{
                branding_wrapper: {
                    display:    'none'
                },
                branding: {
                    height:     'auto'
                },
                megaboard__mobile: {
                    display:    'block',
                    height:     'auto!important'
                },
                branding__area: {
                    display:    'none'
                },
                'branding__megaboard a': {
                    height:     'auto'
                },
                'branding__badge span': {
                    opacity:    0.8
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

        /**
         * Custom pixel tracking - prepare dynamic URL, replacing [variables]
         * @param src
         * @returns {*}
         */
        var prepareVariables = function(src)
        {
            var vars = {
                domain: window.location.hostname,
                path: window.location.pathname + window.location.search,
                campaign: (t.args.ad_server.campaign_name != 'undefined' ? t.args.ad_server.campaign_name : '')
            };

            for (var k in vars){
                src = src.replace('[' + k + ']', vars[k]);
            }


            return src;
        };


        /**
         * print <img> html element
         * @param src
         */
        var print = function(src){
            var p = new Image (1,1);
            p.src = prepareVariables(src);
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
     * BEM helper for nice code
     * @param name
     * @param name
     * @returns {*}
     */
    composeBEM: function(name)
    {
        return this.getArgs().cssPrefixBEM + '__' + name;
    },


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