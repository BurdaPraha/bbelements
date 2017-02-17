function createBranding(optionsObject)
{
    var defaults = {
        type: '',
        creative_first: '',
        creative_second: '',
        creative_megaboard: {
            file: '',
            width: 970,
            height: 120 
        },
        promotion_word: 'Promotion',
        promotion_height: 15,
        drupal_toolbar_height: 80,
        main_bg_options: '',
        background_color: '#fff',
        branding_width: 1700,
        branding_height: 1200,
        megaboard_height: 70,
        page_width: 980,
        element_class: 'branding_wrapper',
        tpl_shared: true,
        css: '',
        html: ''
    };
    
    // merge options
    var args = Object.assign(defaults, optionsObject);
    
    // vyska odsazeni webu
    args.megaboard_height += args.promotion_height;
    
    // allowed with superpowers
    switch(args.type)
    {
        // without action
        case 'anicka':
            args.main_bg_options = 'no-repeat center ' + args.promotion_height + 'px'; 
        break;
        
        // fixed bg
        case 'maruska':
            args.main_bg_options = 'no-repeat fixed center ' + args.promotion_height + 'px'; 
        break;
            
        // auto replicated
        case 'zuzanka':
            args.promotion_height = 10;
            args.main_bg_options = 'repeat-y center ' + args.promotion_height + 'px';
        break;
            
        // with HTML banner to header
        case 'amalka':
        
            // check if valid
            if('' == args.creative_megaboard.file || args.creative_megaboard.file.indexOf('.html') !== -1){return alert('Please fill in creative_megaboard item file')};
            
            args.css+= '.branding__megaboard {}';
            
            args.html+='<div class="branding__megaboard"><iframe src="%%URL%%' + args.creative_megaboard.file + '?redir=%%__REDIRECT_ENCODED%%&bbtarget=_blank" width="' + args.creative_megaboard.width + '" height="' + args.creative_megaboard.height + '" scrolling="no" style="margin:0px; border:0px" seamless></iframe>';
            
        break;
            
        // strip - not working right now, @todo!
        case 'rozarka':
            
            var backgroundDoubleLayerOptions = {
                impressionTrackingUrl: '',
                firstImageUrl:  '%%__URL%%' + args.creative_first,
                secondImageUrl: '%%__URL%%' + args.creative_second,
                clickUrl:       '%%__REDIRECT%%',
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
                script : '%%__CDN_AD_DOMAIN%%/bb/creativelib/ad-scripts/background-double-layer/background-double-layer-script-1.01.js',
                library: '%%__CDN_AD_DOMAIN%%/bb/creativelib/creative-lib-1.02.32.min.js'
            }));
            
        break;
            
        default:
            console.warn('This is type is not allowed!');
    }
    
    // target website element
    var element = document.getElementsByClassName(args.element_class);
    if(0 == element.length)
    {
        console.warn('Not found wrapper for branding with class: ' + args.element_class + '. Using fallback to <body>.');
        
        // element fallback
        element = document.getElementsByTagName("body");
    }
    
    if(element.length)
    {
        // bbelements vars - todo: is this useful?
        var bb_redirection  = '%%__REDIRECT%%';
        var bb_img          = '%%__BANNER%%';
        var bb_title        = '%%__TITLE%%';
        var bb_target       = '%%__TARGET%%';
        var bb_border       = '%%__BORDER%%';

        // calculating
        var bb_WidthR       = ((args.branding_width - args.page_width) / 2);
        var bb_mRight       = bb_WidthR + args.page_width;
        var bb_tempWidth    = (( window.innerWidth - args.page_width) / 2) - 15;
        bb_tempWidth        = bb_tempWidth > bb_WidthR ? bb_WidthR : bb_tempWidth;
        
        // apply background
        element[0].classList.add('branding-active');
        
        if(args.tpl_shared)
        {
            element[0].style.background = (args.background_color ? args.background_color : '') + ' url("%%URL%%'+ args.creative_first +'") ' + args.main_bg_options;

            // tpl
            var css = ""
                + ".branding {width:" + args.page_width + "px; height:" + args.megaboard_height + "px; position:relative; margin:0 auto;}"
                + args.css +
                + ".branding__promotion {width:100%; height:12px; background:#fff; position:absolute; top:-61px; padding:3px 0 0; color:#666; font-size:10px; line-height:10px; text-align:left;}"
                + "._bb3 {width:" + args.page_width + "px; height:" + args.megaboard_height + "px; position:fixed; float:left; outline:none;}"
                + "._bb4 {width:" + bb_WidthR + "px; height:" + args.branding_height + "px; position:absolute; top:0px; left:-" + bb_WidthR + "px;}"
                + "._bb5 {width:100%; height:12px; background:#fff; position:absolute; top:-61px; padding:3px 0 0;}"
                + "._bb6 {width:" + bb_WidthR + "px;height:" + args.branding_height + "px; position:fixed; float:left; outline:none;}"
                + "._bb7 {width:" + bb_tempWidth +"px; height:" + args.branding_height + "px; position:absolute; top:0px; left:" + args.page_width + "px;}"
                + "._bb8 {width:100%; height:12px; background:#fff; position:absolute; top:-61px; padding:3px 0 0;}"
                + "._bb9 {width:" + bb_tempWidth + "px; height:" + args.branding_height + "px; position:fixed; float:left; outline:none;}";

            var html = ""
                + "<div class='branding branding__" + args.type + "'>"
                //+ "<div class='branding__promotion'>"+args.promotion_word+"</div>"
                + args.html +    
                + "<a class='_bb3' href='%%__REDIRECT%%' target='_blank'></a>"
                + "<div class='_bb4'>"
                + "<div class='_bb5'>"
                + "<a class='_bb6' href='%%__REDIRECT%%' target='_blank'></a>"
                + "</div>"
                + "<div class='_bb7 branding__right'>"
                + "<div style='_bb8'></div>"
                + "<a class='_bb9 branding__right' href='%%__REDIRECT%%' target='_blank'></a>"
                + "</div>"
                + "</div>";

            // print it!
            document.write('<!-- start BB CSS --><style>'+css+'</style><!-- end BB CSS --><!-- start BB HTML -->'+html+'<!-- end BB HTML -->');
        }

        // onresize actions
        window.addEventListener('resize', function()
        {
            console.log('window has been resized');
        });

        // do after DOM
        document.addEventListener("DOMContentLoaded", function(e)
        {
            // if is admin logged
            if(document.body.classList.contains("toolbar-horizontal"))
            {
                document.body.style.backgroundPosition = 'center '+(args.promotion_height + args.drupal_toolbar_height)+'px';
            }  
        });
    }
}