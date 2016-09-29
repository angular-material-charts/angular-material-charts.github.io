(function() {

    angular.module('la.core')
    .animation('.slide-horizontal', slideHorizontal);

    slideHorizontal.$inject = ['TweenMax'];

    function slideHorizontal(TweenMax) {
        return {
            addClass: addHideClass,
            removeClass: removeHideClass,
            enter : enter,
            leave : leave,
            move : move
        };
    }

    function addHideClass(element, className, done) {
      if (className == 'ng-hide') {
        TweenMax.set(element, {position:'relative'});
        TweenMax.fromTo(element, 0.5,
            {opacity:1, width:'100%', right:0},
            {opacity:0, width:0, right: -200,  ease: Power2.easeOut, onComplete: done}
        );
      }
      else {
        done();
      }
    }

    function removeHideClass(element, className, done) {
      if (className == 'ng-hide') {
        element.removeClass('ng-hide');
        TweenMax.set(element, {position:'relative'});
        TweenMax.fromTo(element, 0.5,
            {opacity:0, width:0, right: -200},
            {opacity:1, width:'100%',right:0, ease: Power2.easeIn, onComplete: done}
        ).delay(0.3);
      }
      else {
        done();
      }
    }

    function enter(element,done){
        TweenMax.set(element, {position:'relative', opacity:0, width:0, right: -200});
        TweenMax.to(element, 0.5, {opacity:1, width:'100%', right:0, ease: Power2.easeIn, onComplete:done}).delay(0.3);

    }

    function leave(element,done){
        TweenMax.set(element, {position:'relative'});
        TweenMax.to(element, 0.5, {opacity:0, width:0, onComplete:done});
    }

    function move(element,done) {
        TweenMax.to(element, 0.5, {opacity:1, width:'100%', right:0,ease: Power2.easeIn, onComplete:done})
        .delay(0.3);

    }
})();
