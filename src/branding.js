createBranding({
    type: 'anicka',
    creative: {
        first: {
            file: 'branding1700x200.jpg'
        },
        megaboard: {
            file: '765517/index.html',
            width: 700,
            height: 120
        },
        background_color: '#fff'
    }
});

/**
 * Create css factory, todo: Object.keys(cssObject).reduce(fn, default)
 * @param cssObject
 * @returns {string}
 */
function generateCSS(cssObject)
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
function createBranding(myOptions)
{
    const defaultOptions = [{
        type: '',
        creative: {
            first: {
                file: '',
                width: 1700,
                height: 1200                
            },
            second: {
                file: '',
                width: 1700,
                height: 1200
            },
            megaboard: {
                file: '',
                width: 970,
                height: 120
            },
            background_color: '#fff',
            background_options: ''
        },
        tools: {
            pr_word: 'Promotion',
            pr_height: 15,
            drupal_toolbar_height: 80
        },
        page_width: 980, // @todo: think about dynamic looking
        element_class: 'branding_wrapper',
        tpl_shared: true,
        css: '',
        html: ''
    }];
    
    // merge options - todo: bug!!
    //var args = Object.assign(myOptions, defaultOptions);

    const args = Object.assign({}, defaultOptions, myOptions);

    console.log(args);
    
    // vyska odsazeni webu
    args.creative.megaboard.height += args.tools.pr_height;
    
    // allowed with superpowers
    switch(args.type)
    {
        // without action
        case 'anicka':
            args.creative.background_options = 'no-repeat center ' + args.tools.pr_height + 'px'; 
        break;
        
        // fixed bg
        case 'maruska':
            args.creative.background_options = 'no-repeat fixed center ' + args.tools.pr_height + 'px'; 
        break;
            
        // auto replicated
        case 'zuzanka':
            args.tools.pr_height = 10;
            args.creative.background_options = 'repeat-y center ' + args.tools.pr_height + 'px';
        break;
            
        // with HTML banner to header
        case 'amalka':
        
            // check if valid
            if('' == args.creative.megaboard.file || args.creative.megaboard.file.indexOf('.html') !== -1){return alert('Please fill in creative.megaboard item file')};
            
            args.css+= '' +
                '.branding__megaboard iframe {margin:0px; border:0px}';
            args.html+='' +
                '<div class="branding__megaboard">' +
                '<iframe ' +
                        'src="%%URL%%' + args.creative.megaboard.file + '?redir=%%__REDIRECT_ENCODED%%&bbtarget=_blank" ' +
                        'width="' + args.creative.megaboard.width + '" ' +
                        'height="' + args.creative.megaboard.height + '" ' +
                        'scrolling="no" ' +
                        'seamless>' +
                '</iframe>' +
                '</div>';
            
        break;
            
        // strip - not working right now, @todo!
        case 'rozarka':
            
            var backgroundDoubleLayerOptions = {
                impressionTrackingUrl: '',
                firstImageUrl:  '%%__URL%%' + args.creative.first,
                secondImageUrl: '%%__URL%%' + args.creative.second,
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
        console.log(args.creative.first);

        // calculating
        var bb_WidthR       = ((args.creative.first.width - args.page_width) / 2);
        var bb_mRight       = bb_WidthR + args.page_width;
        var bb_tempWidth    = (( window.innerWidth - args.page_width) / 2) - 15;
        bb_tempWidth        = bb_tempWidth > bb_WidthR ? bb_WidthR : bb_tempWidth;
        
        // apply background
        element[0].classList.add('branding-active');
        
        if(args.tpl_shared)
        {
            element[0].style.background = (args.creative.background_color ? args.creative.background_color : '') + ' url("%%URL%%'+ args.creative.first.file +'") ' + args.creative.background_options;
            
            var cssObject = {
                'branding': {
                    width:      args.page_width + 'px',
                    height:     + args.creative.megaboard.height + 'px',
                    position:   'relative',
                    margin:     '0 auto'
                },
                branding__promotion: {
                    width:      '100%',
                    height:     '12px',
                    background: '#fff',
                    position:   'absolute',
                    top:        '-61px',
                    padding:    '3px 0 0',
                    color:      '#666',
                    fontSize:   '10px',
                    line_height: '10px',
                    text_align:  'left'
                },
                branding__bb3: {
                    width:      args.page_width + 'px',
                    height:     args.creative.megaboard.height + 'px',
                    position:   'fixed',
                    float:      'left',
                    outline:    'none'
                },
                branding__bb4: {
                    width:      bb_WidthR + 'px',
                    height:     args.branding_height + 'px',
                    position:   'absolute',
                    top:        0,
                    left:       '-' + bb_WidthR + 'px'
                },
                branding__bb5: {
                    width:      '100%',
                    height:     '12px',
                    background: '#fff',
                    position:   'absolute',
                    top:        '-61px',
                    padding:    '3px 0 0;'
                },
                branding__bb6: {
                    width:      bb_WidthR + 'px',
                    height:     args.branding_height + 'px',
                    position:   'fixed',
                    float:      'left',
                    outline:    'none'
                },
                branding__bb7: {
                    width:      bb_tempWidth +'px',
                    height:     args.branding_height + 'px',
                    position:   'absolute',
                    top:        0,
                    left:       args.page_width + 'px'
                },
                branding__bb8: {
                    width:      '100%',
                    height:     '12px',
                    background: '#fff',
                    position:   'absolute',
                    top:        '-61px',
                    padding:    '3px 0 0'
                },
                branding__bb9: {
                    width:      bb_tempWidth + 'px',
                    height:     args.branding_height + 'px',
                    position:   'fixed',
                    float:      'left',
                    outline:    'none'
                }
            };

            var css = generateCSS(cssObject);
            console.log(css);

            var html = ""
                + "<div class='branding branding__" + args.type + "'>"
                    + "<div class='branding__promotion'>"+args.tools.pr_word+"</div>"/* + args.html + */
                    + "<a class='branding__bb3' href='%%__REDIRECT%%' target='_blank'></a>"
                    + "<div class='branding__bb4'>"
                        + "<div class='branding__bb5'>"
                            + "<a class='branding__bb6' href='%%__REDIRECT%%' target='_blank'></a>"
                        + "</div>"
                        + "<div class='branding__bb7 branding__right'>"
                        + "<div style='branding__bb8'></div>"
                            + "<a class='branding__bb9 branding__right' href='%%__REDIRECT%%' target='_blank'></a>"
                        + "</div>"
                    + "</div>"
                + "</div>";

            // print it!
            document.write('<!-- start BurdaDigital BB --><style>'+css+'</style>'+html+'<!-- end BurdaDigital BB -->');
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
                document.body.style.backgroundPosition = 'center ' + ( args.tools.pr_height + args.tools.drupal_toolbar_height ) + 'px';
            }  
        });
    }
}