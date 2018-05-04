$(document).ready(function () {
    $('#viewRecruitTable').DataTable({
        ajax: "../views/resources/images/2500.txt",
        deferRender: true
    });
});