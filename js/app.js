angular.module("Grocery", ['ngRoute'])

.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "views/list.html",
                controller: "listItemController"
            })
            .when('/add', {
                templateUrl: "views/add.html",
                controller: "listItemController"
            })
            .when('/add/edit/:id', {
                templateUrl: "views/add.html",
                controller: "listItemController"
            })
            .otherwise({
                redirectTo: "/"
            })
    })

.service("GroceryService", function($http) {
    var groceryService = {};
    groceryService.listedItems = [];
	
	$http.get("data/server_data.json")
		.success(function(data){
			groceryService.listedItems = data;
			for(var item in groceryService.listedItems){
				groceryService.listedItems[item].date = new Date(groceryService.listedItems[item].date);
			}
		})
		.error(function(data,status){
			alert(status);
		})

    groceryService.getId = function() {

        if (groceryService.maxId) {
            groceryService.maxId++;
        } else {
            maxId = _.max(groceryService.listedItems, function(val) {
                return val.id
            });
            console.log("ss" + maxId.id);
            groceryService.maxId = maxId.id + 1;
        }
        return groceryService.maxId;
    };

    groceryService.findById = function(obj){
	for(var item in groceryService.listedItems){
	   if( groceryService.listedItems[item].id === obj){
		return 	groceryService.listedItems[item];}
	}
    };

    groceryService.save = function(obj) {
		var updateItem = groceryService.findById(obj.id);
		if(updateItem){
			updateItem.name = obj.name;
			updateItem.date = obj.date;
			updateItem.completed = obj.completed;
		}else{
			obj.id = groceryService.getId();
			groceryService.listedItems.push(obj);
		}
    };
	
	groceryService.checkItem = function(obj){
		obj.completed = !obj.completed;
	};
	groceryService.removeItem = function(obj){
		var index = groceryService.listedItems.indexOf(obj);
		groceryService.listedItems.splice(index,1);
	};

    return groceryService;
})

.controller("GroceryAppController", ['$scope', 'GroceryService', function($scope, GroceryService) {
        $scope.listedItems = GroceryService.listedItems;
		$scope.$watch(function(){return GroceryService.listedItems;},function(listedItems){
			$scope.listedItems = listedItems;
		})
    }])

.controller("listItemController", ['$scope', '$routeParams', '$location', 'GroceryService', function($scope, $routeParams, $location, GroceryService) {
	
	if($routeParams.id){
		$scope.item = GroceryService.findById(parseInt($routeParams.id));
	}else{
    $scope.item = {
            completed: false,
            name: "",
            date: new Date()
        };
	}

	$scope.save = function() {
		GroceryService.save($scope.item);
		$location.path('/');
	};
	
	$scope.checkItem =function(chkItm){
		GroceryService.checkItem(chkItm);
	};
	
	$scope.removeItem = function(delItem){
		GroceryService.removeItem(delItem);
		//$location.path('/');
	};
	$scope.id = "Parameter passed "+$routeParams.id;
    }])

.directive("myGroceryItem",function(){
	return{
		restricts:'E',
		templateUrl:"views/items.html"
	}
});
