# iBillBoard Ads loading library

Drupal 8 module for [bbelements](http://eu.bbelements.com/login.bb?url=%2Fenter%2F) ads printing with own branding solution.
Read article about it here: [Using of Asynchronous codes](http://help.billboard.cz/xwiki/bin/view/AdServer+v2/UsageAsynCodes?language=en).

**Still under development.**

## How it works?

1. download module via composer (or via [npm / yarn](#how-can-i-use-it-without-drupal)):

    `composer require burdapraha/bbelements dev-master`

2. You just need create blocks with markdown like this:


    ```
    <div id="05500400-3893-4623-a661-46a6e32d9a24" data-bbelements-id="248828.1.2.9"></div>
            
    - `id` of <div> must be unique, good for it is block uuid
    - `data-bbelements-id` is unique identificator of advertising in bbelements system
    ```

    
3. javascript will inspect DOM of page and find all positions with these ids and will make request to adserver. Ads will be printed from system. 


## Google Tag Manager settings

Import [this container JSON file](./docs/GTM.json) to your GTM account, [see more here](https://www.lunametrics.com/blog/2015/08/26/import-container-google-tag-manager/).

Steps:

1. [Download JSON](./docs/GTM.json)
2. Rename `UA-XXXXXX-YY` to your GA code in this file
3. Admin => Import Container
4. Choose container file (what you download from here)
5. Choose workspace: Existing => (your workspace, probably Default)
6. Choose an import options: Merge => Rename conflicting tags, triggers and variables
7. View Detailed Changes
8. Confirm

## How can I use it without Drupal?

Sure! Easily.. 

`yarn install @burdapraha/bbelements` or `npm install @burdapraha/bbelements`

*Implementation:*

```
<head>
...
<script src="//bbcdn-static.bbelements.com/scripts/ibb-async/stable/tag.js"></script>
...
</head>
<body>

    ...

    <!-- this is example positions somewhere in page -->
    <div id="ab" data-bbelements-id="248828.1.2.7"></div>
    <div id="xy" data-bbelements-id="248828.1.2.8"></div>
    <div id="zy" data-bbelements-id="248828.1.2.9"></div>

    ...

    <!-- if you don't using branding, skip this lib -->
    <script src="{{ your_assets_path }}/js/branding.js"></script>
    
    <!-- core ads libs ->
    <script src="{{ your_assets_path }}/js/ads.js"></script>
    <script src="{{ your_assets_path }}/js/wrapper.js"></script>

</body>
```
