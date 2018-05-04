$(document).ready(function () {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaa');
    
    console.log('zzzzzzzzzzzzzzzzzzzzzzzzz');
    //Table gets populated via the rOut post function in recruits.js
    var table = $('#recruitDetails').DataTable({
        ajax: {
            url: '/shiftninja/populate-recruit-deatails-datatable',
            type: 'POST',
            dataType: 'json'
        },
        columns: [
            { 'data': 'recID' },
            { 'data': 'recRecruitRef' },
            { 'data': 'recTitle' },
            { 'data': 'recFirstN' },
            { 'data': 'recSurN' },
            { 'data': 'recForeN' },
            { 'data': 'recAddress' },
            { 'data': 'recMobile' },
            { 'data': 'allQuals' },
            { 'data': 'recActive' },
            { 'data': 'recExperience' },
            { 'data': 'recProfilePic' },
            { 'data': 'allShifts' }
        ]
    });
}); 