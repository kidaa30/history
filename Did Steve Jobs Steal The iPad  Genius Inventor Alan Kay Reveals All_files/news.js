var timeoutToHide;
var eltToHide;

function adjustSubNavPos(elts) {
    elts.each(function(elt) {
        var navElts     = Element.childElements( elt );
        var aTag        = navElts[0];
        var contentTag  = navElts[1];

        aTag.observe('mouseover', onNavMouseOver);
        aTag.observe('mouseout', onNavMouseOut);
        contentTag.setStyle({top:aTag.getHeight()+2+'px'});
        contentTag.observe('mouseover', onNavMouseOver);
        contentTag.observe('mouseout', onNavMouseOut);
        contentTag.fade({ duration: 0, from: 0, to: 0 });
    });
}

function getBlockToToggle(elt) {
    if(elt.up(0).hasClassName('pagiNewsContainer')) {
        var pagiNewsSub = (elt.tagName=="A") ? elt.next() : elt;
        return pagiNewsSub;
    }
    else
        return null;
}

function onNavMouseOver(e) {
    var pagiNewsSub;
    cancelHideSubNav();

    if((pagiNewsSub = getBlockToToggle(e.element()))){
        pagiNewsSub.previous().addClassName('hoverTrigger');

        if(pagiNewsSub.opacity<0.1) {
            //pagiNewsSub.fade({ duration: 0.2, from: 0, to: 1 });
            pagiNewsSub.show();
        }
        pagiNewsSub.setStyle({display: 'block'});
    }
}

function onNavMouseOut(e) {
    var pagiNewsSub;
    if((pagiNewsSub = getBlockToToggle(e.element()))){
        delayHideSubNav(pagiNewsSub);
    }
}

function delayHideSubNav(elt) {
    eltToHide = elt;
    timeoutToHide = setTimeout("hideSubNav()",25);
}

function hideSubNav() {
    eltToHide.hide();
    //eltToHide.fade({ duration: 0.2, from: 1, to: 0 });
    eltToHide.previous().removeClassName('hoverTrigger');
}

function cancelHideSubNav() {
    clearTimeout(timeoutToHide);
}

document.observe('dom:loaded', function() {
    if($('pagiNews') && $('pagiLeft') && $('pagiRight')) {
        adjustSubNavPos(['pagiLeft', 'pagiRight']);
    }
});