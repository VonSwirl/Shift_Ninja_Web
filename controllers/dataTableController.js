/* Formatting function for row details - modify as you need */
function format(d) {
    return '<table >' + '</table>';
}
function redirectToRecDetails(data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = 'http://http://127.0.0.1:3000/shiftninja//viewRecruitDetails/' + data;
    /* for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    } */
    form.submit();
}
$(document).ready(function () {
    //Table gets populated via the rOut post function in recruits.js
    var table = $('#viewRecruitTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/shiftninja/viewAllRecruits',
            type: 'POST',
            dataType: 'json'
        },
        columns: [{
            'className': 'details-control', 'orderable': false,
            'data': null, 'defaultContent': ''
        },
        { 'data': 'recID' }, { 'data': 'recTitle' }, { 'data': 'recFirstN' },
        { 'data': 'recSurN' }, { 'data': 'recAddress' },
        { 'data': 'recMobile' }, { 'data': 'recActive' }
        ],
        'order': [[1, 'asc']],
    });
    // When "eye" image is clicked on a specific row the user is forwarded to view recruit page
    $('#viewRecruitTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        const recSelected = row.data().recRecruitRef;

        if (row.child.isShown()) {
            // Change "eye" back to green
            row.child.hide();
            tr.removeClass('shown');

        } else {
            row.child(format()).show();
            tr.addClass('shown');
            if (recSelected != null) {                
                    redirectToRecDetails(recSelected); 
            }
        }
    });
});
