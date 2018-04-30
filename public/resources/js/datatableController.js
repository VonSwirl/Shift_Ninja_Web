/* Formatting function for row details - modify as you need */
function format(d) {
    return '<table >' + '</table>';
}
/*   $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'http://localhost:3000/shiftninja/viewRecruitDetails/'+data,
      success: function (data) {
          console.log('success');
          console.log(JSON.stringify(data));
      }
  }); */


//var urlString = 'http://localhost:3000/shiftninja/viewRecruitDetails/' + data;
//window.location.replace(urlString);

//$.post(urlLink).done(function (data, textStatus, jqXHR) {
//    alert(data);
//});




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
                $.redirect("viewRecruitDetails/" + recSelected);
            }
        }
    });
});
