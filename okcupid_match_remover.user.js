// ==UserScript==
// @name         OkCupid Match Remover
// @namespace    stephenbrown2.okcupid
// @version      0.1
// @description  Warns of or hides matches which aren't actually a good match, based on their age preferences, low match percentage or star rating, or previously contacted 
// @match        https://www.okcupid.com/match*
// @copyright    2014+, Stephen Brown II
// @license      GNU GPL v3.0 or later. http://www.gnu.org/copyleft/gpl.html
// @downloadURL  https://raw.githubusercontent.com/StephenBrown2/monkey-scripts/master/okcupid_match_remover.user.js
// ==/UserScript==

// 1 = warn with colors
// 2 = hide from match page
// 3 = fully hide profile on OKC
var action = 1;

var min_match = 75;

function getDocument(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET",url,false);
  xmlhttp.send();
  var resptxt = xmlhttp.responseText;
  var docimpl = document.implementation.createHTMLDocument(null);
  docimpl.documentElement.innerHTML = resptxt;
  return docimpl;
}

var my_profile = getDocument('https://www.okcupid.com/profile');
var my_age = my_profile.getElementById('ajax_age').innerHTML.trim();

var cards = document.getElementsByClassName('match_card_wrapper user-not-hidden');
for (var i = 0; i < cards.length; i++) {
    var box = cards[i];
    var matchE = box.getElementsByClassName('percentages');
    var match = matchE[0].textContent.split('%')[0].trim();
    var contact = box.getElementsByClassName('bar last_contact');
    var rating = box.getElementsByClassName('current-rating')[0].style.width.split('%')[0]/20;
    var username = box.id.split('-')[1];
    var profile_url = 'https://www.okcupid.com/profile/' + username;
    var their_profile = getDocument(profile_url);
    var low_age = their_profile.getElementById('ajax_ages').innerHTML.split(' ')[1].split('–')[0];
    var high_age = their_profile.getElementById('ajax_ages').innerHTML.split(' ')[1].split('–')[1];
    var message = 'She is looking for someone like you. ;-)';
    var color = 'limegreen';
    var hide = 0;
    
    if (match < min_match) {
        message = 'Match% is too low';
        color = 'orange';
        hide = 1;
	} else if (contact.length > 0) {
        message = 'Contacted already';
        color = 'grey';
        hide = 1;
	} else if (rating > 0 && rating < 4) {
        message = 'Low Rating';
        color = 'purple';
        hide = 1;
	} else if (my_age < (parseInt(low_age, 10) - 1) ) {
        message = 'You are too young for her?';
        color = 'blue';
        hide = 1;
    } else if (my_age > (parseInt(high_age, 10) + 1) ) {
        message = 'You are too old for her?';
        color = 'yellow';
        hide = 1;
    }

    if (hide == 1) {
        if (action == 1) {
            box.style.border = '3px solid '+color;
        } else if (action == 2) {
            box.style.display = 'none';
        } else if (action == 3) {
            box.getElementsByTagName('a')[0].click();
        }
    } else {
        if (action == 1) {
            box.style.border = '3px solid limegreen';
        }
    }
}
