/* Formatting function for row details - modify as you need */
function format(d) {
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td> Job Description: </td>' +
        '<td>' + d.shiftRole + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Shift Start: </td>' +
        '<td>' + d.shiftStart + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Shift End: </td>' +
        '<td>' + d.shiftEnd+ '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Shift Pay Catagory: </td>' +
        '<td>' + d.shiftRateCode + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td> Pay Hourly/Shift: </td>' +
        '<td>' + d.shiftPay + '</td>' +
        '</tr>' +
        '</table>';
}
var recSelected = null;
$(document).ready(function () {
    //Table gets populated via the rOut post function in recruits.js
    var table = $('#viewShiftsTable').DataTable({
        ajax: {
            url: '/shiftninja/populateViewShiftsDatatable',
            type: 'POST',
            dataType: 'json'
        },
        columns: [{
            'className': 'details-control', 'orderable': false,
            'data': null, 'defaultContent': ''
        },
        { 'data': 'shiftID' },
        { 'data': 'recID' },
        { 'data': 'shiftCompanyName' },
        { 'data': 'shiftAddress' }],
        'order': [[1, 'asc']],
    });
    // When "eye" image is clicked on a specific row the user is forwarded to view recruit page
    $('#viewShiftsTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // Change "eye" back to green
            row.child.hide();
            tr.removeClass('shown');

        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
});