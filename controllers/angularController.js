angularModule = angular.module('angularModule', []);
angular.module('showcase.withOptions', ['datatables']).controller('WithOptionsCtrl', WithOptionsCtrl);

function angularControl() {
    angularModule.controller('angularController', ['$scope', function ($scope) {
        $scope.message = "sup";
        $scope.words = ["this", "that", "other"]

    }]);
}



function WithOptionsCtrl(DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withDisplayLength(2)
        .withDOM('pitrfl');
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];
}

module.exports = { angularControl, angular };







