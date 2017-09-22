# iBillBoard Ad server Drupal 8 module

Drupal 8 module for [bbelements](http://eu.bbelements.com/login.bb?url=%2Fenter%2F) ads printing with own branding solution.
Read article about it here: [Using of Asynchronous codes](http://help.billboard.cz/xwiki/bin/view/AdServer+v2/UsageAsynCodes?language=en).

**Still under development.**

## How it works?

1. You just need create blocks with markdown like this:


    ```
    <div id="05500400-3893-4623-a661-46a6e32d9a24" data-bbelements-id="248828.1.2.9"></div>
            
    - `id` of <div> must be unique, good for it is block uuid
    - `data-bbelements-id` is unique identificator of advertising in bbelements system
    ```

    
2. javascript will inspect DOM of page and find all positions with these ids and will make request to adserver. Ads will be printed from system. 

