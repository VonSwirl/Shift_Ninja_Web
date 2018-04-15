var angularModule = angular.module('angularModule', []);

function angularControl() {
    angularModule.controller('angularController', ['$scope', function ($scope) {
        $scope.message = "sup";
        $scope.words = ["this", "that", "other"]

    }]);
}
module.exports = { angularControl };