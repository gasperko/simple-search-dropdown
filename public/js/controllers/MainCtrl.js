angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {

    // load country data
	load_country_data();
	function load_country_data(){
		$http.get('/load_country').success(function(data){
			$scope.countries=data;
		}).error(function(data) {
            console.error("error in getting countries");
        })
	}

    //initialize $scope.selected.value
    $scope.selected = { value: {country: 'Search', cnt: 0} };

    $scope.sub = function(){
    	$http.post('/find_cud', $scope.selected.value).success(function(data) {
            $scope.customers=data;
        }).error(function(data) {
            console.error("error in posting");
        })
    }

});