window.bb_attr_name        = 'data-bbelements-id'; // todo: load from module settings
window.bb_all_positions    = null;


// start with printing ads <3
bb_create();


/**
 * something like a constructor
 */
function bb_create()
{
    var adServer = ibbAds.tag.useAdProvider('BbmEu'); // Create bbElements variable if ibbAds exist

    bb_handlers();

    // run something live
    bb_fillManageSlot(bb_findPositions(), adServer);

    // make request to bbelements server
    ibbAds.tag.requestAndPlaceAds(adServer);
}


/**
 * Native bbelements handlers
 */
function bb_handlers()
{
    // if ad has some conentet to render
    ibbAds.tag.on('ADS_WRITTEN_TO_AD_SLOT', function (event) {
        var id = event.getData().slotId;
        document.getElementById(id).classList.add('promotion__slot--active');
    });

    // there is no content in ad for rendering
    ibbAds.tag.on('NO_AD_RETURNED_FOR_AD_SLOT', function(event) {
        var id = event.getData().getCustomId();
        document.getElementById(id).classList.add('promotion__slot--empty');
    });
}


/**
 * find in DOM all <div> which has filled data-position-id="XY" and get his ID
 */
function bb_findPositions()
{
    var array = [];
    if(null == window.bb_all_positions)
    {
        var elements = [].slice.call(document.querySelectorAll('div['+window.bb_attr_name+']'));

        elements.forEach(function(i)
        {
            id_el = i.getAttribute('id');
            id_bb = i.getAttribute(window.bb_attr_name);

            if(id_bb && '' !== id_bb)
            {
                array.push([id_el, id_bb]);
            }
        });

        window.bb_all_positions = array;
    }
    else
    {
        array = window.bb_all_positions;
    }


    return array;
}


/**
 * say bbelements about position to load!
 */
function bb_fillManageSlot(array, adServer)
{
    array.forEach(function(i)
    {
        adServer.manageAdSlot(i[0], i[1]);
    });
}


/**
 * get only element ids from loaded array of positions
 */
function bb_getPositionElementIds()
{
    var flat = [];
    var list = bb_findPositions();

    list.forEach(function(i)
    {
        flat.push(i[0]);
    });


    return flat;
}


/**
 * make request to bbelements for reload all positions on site
 * can be used in external scripts like a photo gallery
 */
function bb_reloadAllPositions()
{
    var ids = bb_getPositionElementIds();
    ibbAds.tag.requestAndPlaceAds(ids);


    console.info("ads reloaded");
}