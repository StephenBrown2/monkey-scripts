// ==UserScript==
// @name         ChristianMingle javascript remover
// @namespace    stephenbrown2.christianmingle
// @version      0.1
// @description  Remove unnecessary javascript from OKCupid.com pages, replacing it with proper links. Based on http://userscripts.org/scripts/show/29658
// @match        http://www.christianmingle.com/*
// @copyright    2014+, Stephen Brown II
// @license      GNU GPL v3.0 or later. http://www.gnu.org/copyleft/gpl.html
// @downloadURL  https://raw.githubusercontent.com/StephenBrown2/monkey-scripts/master/christianmingle_js_remover.user.js
// ==/UserScript==

/* From http://wiki.greasespot.net/Code_snippets */
function $xpath(p, context)
{
    if(!context) {
        context = document;
    }
    var i, item,
        arr = [],
        xpr = document.evaluate(p, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for(i = 0; i < xpr.snapshotLength; i++) {
        arr.push(xpr.snapshotItem(i));
    }
    return arr;
}


//modules
function popup_profiles()
{
    var pops = $xpath('//a[starts-with(@href, "javascript:popup_profile")]');
    pops.forEach(function(link)
                 {
                     var oldHref = link.getAttribute('href'),
                         newHref = oldHref.replace(/javascript:popup_profile\('(([^']|\\')+)'\);.*/, '$1');
                     if(oldHref !== newHref) {
                         link.setAttribute('href', newHref);
                     }
                 });
}

popup_profiles();
