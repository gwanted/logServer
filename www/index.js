var app = angular.module("log", []);
app.controller("logCtr", function ($scope, $http) {
    $scope.project = "openapi";
    $scope.filePath = "";
    $scope.len = 100;
    $scope.logJsons = [];
    var logsss = [];
    $scope.initData = function (cb) {
        $http.get("/logs?len="+$scope.len+"&name="+$scope.project+"&path="+$scope.filePath, {})
            .success(function (resp) {
                logsss=[];
                if (resp.code) {

                }else {
                    $scope.logs = resp;

                    var logStr = $scope.logs;
                    var tmp = logStr.match(/\{"level":.*"\}/g);
                    if (tmp) {
                        for (var i = tmp.length - 1; i >= 0; i--) {
                            var str = JSON.parse(tmp[i]);
                            logsss.push(str)
                        }
                    }
                    if (cb)cb();
                    setTimeout(function () {
                        $scope.initData(function () {
                            $scope.logJsons=logsss;
                            // $scope.$apply();
                        });
                    }, 5000);
                }
            });
    };
    $scope.initData(function () {
        $scope.logJsons=logsss;
    });
});

