function MainCtrl($scope){

    $(window).on('resize',function(){
    	$scope.$broadcast("resize",1);
    });
}

angular
    .module('vroom-vroom')
    .controller('MainCtrl', MainCtrl);