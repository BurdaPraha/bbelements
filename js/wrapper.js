/**
 * load all ads after
 */
document.addEventListener("DOMContentLoaded", function(e)
{
    window.BurdaAdsLayer = new BurdaAds();
    //window.BurdaAdsLayer.setDev(true);
    window.BurdaAdsLayer.create();

});

/**
 * fallback support for bbelements
 * @param myOptions
 * @constructor
 */
function BD_CreateBranding(myOptions)
{
    BurdaAdsLayer.createBranding(myOptions);
}

/**
 * support for reloading in external scripts like a gallery
 * @constructor
 */
function BD_Reload(){
    BurdaAdsLayer.reloadAll();
}