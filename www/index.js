var app = angular.module("log", []);
app.controller("logCtr", function ($scope, $http) {
    $scope.project = "openapi";
    $scope.filePath = "";
    $scope.len = 100;
    $scope.logJsons = [];
    $scope.initData = function () {
        $http.get("/logs?len="+$scope.len+"&name="+$scope.project+"&path="+$scope.filePath, {})
            .success(function (resp) {
                $scope.logs = resp;

                var logStr = $scope.logs;
                var tmp = logStr.match(/\{"level":.*"\}/g);
                if (tmp){
                    for(var i=tmp.length-1;i>=0;i--){
                        var str = JSON.parse(tmp[i]);
                        $scope.logJsons.push(str)
                    }
                }
                setTimeout(function () {
                    $scope.initData();
                },5000);
            });
    };
    $scope.initData();
});

