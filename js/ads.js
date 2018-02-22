BurdaAds = function() {};
BurdaAds.prototype = {


    create: function()
    {
        this.bb_attr_name       = 'data-bbelements-id';
        this.bb_all_positions   = null;
        this.branding 			= null;
        this.dev                = false;


        this.bb_create();
    },


    /**
     * something like a constructor
     */
    bb_create: function ()
    {
        /** Create bbElements variable if ibbAds exist (bbelements tag library must be loaded before this script) */
        var adServer = ibbAds.tag.useAdProvider('BbmEu');

        this.bb_fillManageSlot(this.bb_findPositions(), adServer);
        this.bb_handlers();


        // make request to bbelements server
        ibbAds.tag.requestAndPlaceAds(adServer);
    },


    /**
     * find in DOM all <div> which has filled data-position-id="XY" and get his ID
     */
    bb_findPositions: function ()
    {
        var array = [];
        if(null === this.bb_all_positions)
        {
            var elements    = [].slice.call(document.querySelectorAll('div['+this.bb_attr_name+']'));
            var attribute   = this.bb_attr_name;

            elements.forEach(function(i)
            {
                var id_el = i.getAttribute('id');
                var id_bb = i.getAttribute(attribute);

                if(id_bb && '' !== id_bb)
                {
                    array.push([id_el, id_bb]);
                }
            });

            this.bb_all_positions = array;
        }
        if(this.dev){console.info('positions:', this.bb_all_positions);}


        return this.bb_all_positions;
    },


    /**
     * say bbelements about position to load!
     */
    bb_fillManageSlot: function (array, adServer)
    {
        array.forEach(function(i)
        {
            adServer.manageAdSlot(i[0], i[1]);
        });
    },


    /**
     * Native bbelements handlers
     */
    bb_handlers: function ()
    {
        // if ad has some conentet to render
        ibbAds.tag.on('ADS_WRITTEN_TO_AD_SLOT', function (event) {
            var id = event.getData().slotId;
            document.getElementById(id).parentNode.classList.add('promotion__slot--active');
        });

        // there is no content in ad for rendering
        ibbAds.tag.on('NO_AD_RETURNED_FOR_AD_SLOT', function(event) {
            var id = event.getData().getCustomId();
            document.getElementById(id).parentNode.classList.add('promotion__slot--empty');
        });
    },


    /**
     * get only element ids from loaded array of positions
     */
    bb_getPositionElementIds: function ()
    {
        var flat = [];
        var list = this.bb_findPositions();

        list.forEach(function(i)
        {
            flat.push(i[0]);
        });


        return flat;
    },


    /**
     * private function
     * make request to bbelements for reload all positions on site
     */
    bb_reloadAllPositions: function ()
    {
        var ids = this.bb_getPositionElementIds();
        ibbAds.tag.requestAndPlaceAds(ids);


        if(this.dev){console.info("ads reloaded");}
    },


    /**
     * init branding script
     * @param myOptions object
     */
    createBranding: function(myOptions)
    {
        this.branding = new BD_Branding();
        this.branding.create(myOptions);
    },


    /**
     * Create flagged URL from actual URL for Virtual Page View filtering @ GA
     * @param absolute
     * @returns {string}
     */
    getFlaggedUrl: function(absolute)
    {
        var l = window.location;
        var h = (l.hasOwnProperty('hash') ? l.hash : '');
        var u = (absolute ? l.href : l.pathname + l.search).replace(h, '');
        var s = (l.hasOwnProperty('search') ? '&' : '?');


        return u + s + 'flag=virtual_page_view';
    },


    /**
     * do PV for netMonitor / gemius
     */
    netMonitorPV: function()
    {
        if('undefined' !== typeof(pp_gemius_identifier))
        {
            pp_gemius_hit(pp_gemius_identifier);
            //gemius_hit(pp_gemius_identifier)
        }
        else
        {
            if(this.dev){console.warn('Gemius (NetMonitor) id not defined!');}
        }
    },


    /**
     * do GA PV
     */
    googleAnalyticsPV: function()
    {
        if (typeof window.dataLayer != "undefined")
        {
            window.dataLayer.push({
                event:      'page_view',
                title:      document.title,
                page:       this.getFlaggedUrl(false),
                location:   this.getFlaggedUrl(true)
            });
        }
        else
        {
            if(this.dev){console.log("No Google Tag Manager available");}
        }
    },


    /**
     * do PV for Facebook
     */
    facebookPixelPV: function()
    {
        if('undefined' !== typeof(fbq))
        {
            fbq('track', 'PageView');
        }
        else
        {
            if(this.dev){console.warn('Facebook pixel not found!');}
        }
    },


    /**
     * reload all ads position, clear branding wrapper div
     */
    reloadAll: function()
    {
        /** hit page views */
        this.googleAnalyticsPV();
        this.netMonitorPV();
        this.facebookPixelPV();

        /** branding can missing, if we don't using branding script for current campaign */
        if(null !== this.branding)
        {
            var args = this.branding.getArgs();
            var wrap = document.getElementsByClassName(args.element_class);

            if(wrap[0])
            {
                wrap[0].removeAttribute('style');
                wrap[0].innerHTML = '';
            }
        }

        /** clear <body> inline styles */
        document.body.removeAttribute('style');

        /** bbelements positions */
        this.bb_reloadAllPositions();
    },


    /**
     * setter
     */
    setDev: function(state)
    {
        this.dev = state;
    }
};