var app = angular.module("log", []);
app.controller("logCtr", function ($scope, $http) {
    $scope.project = "openapi";
    $scope.len = 10;
    $scope.initData = function () {
        $http.get("/logs?len="+$scope.len+"&name="+$scope.project, {})
            .success(function (resp) {
                $scope.logs = resp;
            });
    };
    $scope.initData();
});

