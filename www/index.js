var app = angular.module("log", []);
app.controller("logCtr", function ($scope, $http) {
    $scope.project = "openapi";
    $scope.filePath = "";
    $scope.len = 300;
    $scope.keyword = "";
    $scope.logJsons = [];
    $scope.autoRefreshTime = 5;
    var logsss = [];
    $scope.initData = function () {
        $http.get("/logs?len="+$scope.len+"&name="+$scope.project+"&path="+$scope.filePath+"&key="+$scope.keyword, {})
            .success(function (resp) {
                logsss=[];
                if (resp.code==200) {
                    $scope.logs = resp.data;

                    var logStr = $scope.logs;
                    var tmp = logStr.match(/\{"level":.*\}/g);
                    if (tmp) {
                        for (var i = tmp.length - 1; i >= 0; i--) {
                            var str = JSON.parse(tmp[i]);
                            logsss.push(str)
                        }
                    }
                    $scope.logJsons=logsss;
                    setTimeout(function () {
                        $scope.initData();
                    }, $scope.autoRefreshTime*1000);
                }else {
                    console.log(resp.msg)
                }
            })
            .error(function (resp) {
                console.log(resp)
            });
    };
    $scope.initData();
});

