(function() {

    angular.module('la.core')
    .animation('.panelAnimation', slideVertical);

    slideVertical.$inject = ['TweenMax'];

    function slideVertical(TweenMax) {
        return {
            addClass: addHideClass,
            removeClass: removeHideClass
        };
    }

    function addHideClass(element, className, done) {
      if (className == 'ng-hide') {
        TweenMax.fromTo(element, 0.4,
            {opacity:1, height:'100%'},
            {opacity:0, height:0,  ease: Power2.easeOut, onComplete: done}
        ).delay(0.2);
      }
      else {
        done();
      }
    }

    function removeHideClass(element, className, done) {
      if (className == 'ng-hide') {
        element.removeClass('ng-hide');
        TweenMax.fromTo(element, 0.5,
            {opacity:0, height:0},
            {opacity:1, height:'100%',  ease: Power2.easeIn, onComplete: done}
        ).delay(0.5);
      }
      else {
        done();
      }
    }
})();
