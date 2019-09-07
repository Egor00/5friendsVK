var myApp=angular.module('yourFriendsApp');
myApp.controller('authController', function($scope){
    $scope.authorized = 'unknown';
    VK.init({apiId: 6837243});
    VK.Auth.getLoginStatus(function(response){
        if(response.status != "connected"){
            $scope.authorized = 'no';
            $scope.$evalAsync();
            return;
        }
        VK.Api.call('users.get', {user_ids : response.session.mid,v : "5.92"},
            function(res){
                $scope.first_name = res.response[0].first_name;
                $scope.last_name = res.response[0].last_name;
                $scope.authorized = 'yes';
                setFriends(response.session.mid);
            });
    });
    
	$scope.logout = function(){
	    VK.Auth.logout(function(response){
            $scope.first_name = "";
            $scope.last_name = "";
            $scope.authorized = 'no';
            $scope.$evalAsync();
	    });
	};
	$scope.login = function(){
        VK.Auth.login(function(response) {
            $scope.first_name = response.session.user.first_name;
            $scope.last_name = response.session.user.last_name;
            $scope.authorized = 'yes';
            setFriends(response.session.user.id);
        }, 65538);
	};
	
	function setFriends(user_id){
	    $scope.friends = [];
	    VK.Api.call("friends.get", {user_ids : user_id, order : "random", count : "5", fields : "photo_50, domain",v : "5.92"},
        function(res){
            res.response.items.forEach(function(item) {
                 $scope.friends.push({ 
                                    first_name  : item.first_name,
                                    last_name   : item.last_name,
                                    user_photo  : item.photo_50,
                                    domain      : item.domain
                                    });
            });
            $scope.$evalAsync();
        });
	}
});