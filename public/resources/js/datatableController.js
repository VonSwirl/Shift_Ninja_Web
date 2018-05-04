/* Formatting function for row details - modify as you need */
function format(d) {
    return '<table >' + '</table>';
}

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
                $.redirect("/shiftninja/recruitdetails", { recRef: recSelected });

                // $.redirect("viewRecruitDetails/" );
                //window.location.replace("http://stackoverflow.com");
                //window.location.href = "/shiftninja/recruitdetails";
                //window.location.replace('/shiftninja/recruitdetails');

                /* $.post('/shiftninja/recruitdetails', { ref: recSelected }, function () {
                    window.location = '/shiftninja/recruitdetails/' + recSelected;
                });
                return false; */

                /*  $.ajax(
                     {
                         type: 'get',
                         url: '/shiftninja/recruitdetails/'+recSelected,
                         data: {
                             "ref": recSelected
                         },
                         success: function (response) {
                             console.log("SUCCESS");
                             window.location = '/shiftninja/recruitdetails/'+recSelected;
                         },
                         error: function () {
                             alert("rec: " + recSelected + "     type " + typeof (recSelected));
                         }
                     }
                 ); */

            }
        }
    });
});

$(document).ready(function () {
    //Table gets populated via the rOut post function in recruits.js
    var table = $('#recruitDetails').DataTable({
        ajax: {
            url: '/shiftninja/viewRecruitDetails/',
            type: 'POST',
            dataType: 'json'
        },
        columns: [
            { 'data': 'recRecruitRef' }, { 'data': 'recTitle' }, { 'data': 'recFirstN' },
            { 'data': 'recSurN' }, { 'data': 'recAddress' },
            { 'data': 'recMobile' }, { 'data': 'recActive' }
        ]
    });
}); 