var app = angular.module("log", []);
app.controller("logCtr", function ($scope, $http) {
    $scope.project = "openapi";
    $scope.filePath = "";
    $scope.len = 300;
    $scope.keyword = "";
    $scope.logJsons = [];
    $scope.autoRefreshTime = 5;
    var logsss = [];

    $scope.projects = [
        {name: 'openapi', path: '/mnt/log/abo/new/openapi/out.log'},
        {name: 'api', path: '/mnt/log/abo/new/api/out.log'},
        {name: 'adminapi', path: '/mnt/log/abo/new/adminapi/out.log'},
        {name: 'nurseapi', path: '/mnt/log/abo/new/nurseapi/out.log'},
        {name: 'mc', path: '/mnt/log/abo/new/mc/mc.log'},
        {name: 'doctorapi', path: '/mnt/log/abo/new/doctorapi/out.log'},
        {name: 'fileapi', path: '/mnt/log/abo/new/fileapi/out.log'}
    ];

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
                            if (str.path){
                                var params=[];
                                var tmpPath = str.path.split("?");
                                if (tmpPath.length>0) {
                                    params.push(tmpPath[0]);
                                    if (tmpPath[1]) {
                                        var tmp1 = tmpPath[1].split("&");
                                        angular.forEach(tmp1, function (value) {
                                            params.push(value)
                                        })
                                    }
                                }
                                str.path = params
                            }
                            if (str.body){
                                var bds = [];
                                var tmpbd = str.body.split(",");
                                angular.forEach(tmpbd,function (value) {
                                    bds.push(value)
                                });
                                str.body = bds;
                            }
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

