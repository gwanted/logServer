var app = angular.module("log", []);
app.controller("logCtr", function ($scope, $http) {
    $scope.project = "openapi";
    $scope.filePath = "/home/awesome/out.log";
    $scope.len = 10;
    $scope.initData = function () {
        $http.get("/logs?len="+$scope.len+"&name="+$scope.project+"&path="+$scope.filePath, {})
            .success(function (resp) {
                $scope.logs = resp;
            });
    };
    $scope.initData();
});

