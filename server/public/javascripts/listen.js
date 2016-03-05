(function(){
'use strict';
var app = angular.module('listen', []);

app.controller("ListenController", ['$scope', '$http', function($scope, $http){

	$scope.listen = function(){
      console.log('Listen function');
      //send post request to get the file and its content
      $http.post('http://0571a5ea.ngrok.io/listen', {})
        .success(function(data, status){
          console.log(data);
          console.log('Listen send OK');
        })
        .error(function(data, status){
          console.log("Error to the post request for the file content in angular");
        });
	}
}]);
})();