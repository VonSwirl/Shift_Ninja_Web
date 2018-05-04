/* Formatting function for row details - modify as you need */
function format(d) {
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +

        '<tr>' +
        '<td> ID: </td>' +
        '<td>' + d.recID + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Recruit Reference: </td>' +
        '<td>' + d.recRecruitRef + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Title: </td>' +
        '<td>' + d.recTitle + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Qualifications: </td>' +
        '<td>' + d.allQuals + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Active Status: </td>' +
        '<td>' + d.recActive + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Experience: </td>' +
        '<td>' + d.recExperience + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Shifts Worked: </td>' +
        '<td>' + d.allShifts + '</td>' +
        '</tr>' +
        '</table>';
}
var recSelected = null;
$(document).ready(function () {
    //Table gets populated via the rOut post function in recruits.js
    var table = $('#viewRecruitTable').DataTable({
        ajax: {
            url: '/shiftninja/populateViewRecruitsDatatable',
            type: 'POST',
            dataType: 'json'
        },
        columns: [{
            'className': 'details-control', 'orderable': false,
            'data': null, 'defaultContent': ''
        },
        { 'data': 'recFirstN' },
        { 'data': 'recSurN' },
        { 'data': 'recForeN' },
        { 'data': 'recAddress' },
        { 'data': 'recMobile' }],
        'order': [[1, 'asc']],    
    });
    // When "eye" image is clicked on a specific row the user is forwarded to view recruit page
    $('#viewRecruitTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        recSelected = row.data().recRecruitRef;

        if (row.child.isShown()) {
            // Change "eye" back to green
            row.child.hide();
            tr.removeClass('shown');

        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown');
            /*     if (recSelected != null) {
                    $.redirect("/shiftninja/recruitdetails", { recRef: recSelected });
                } */
        }
    });
});


