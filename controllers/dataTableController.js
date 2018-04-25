$(document).ready(function () {
    $('#viewRecruitTable').dataTable({
        ajax: {
            url: 'http://127.0.0.1:3000/recruits/viewRecruits',
            type: 'POST',
            dataType: 'json'
        },
        //serverSide: true,
        //"processing": true,
        columns: [
            { 'data': 'recID' },
            { 'data': 'recTitle' },
            { 'data': 'recFirstN' },
            { 'data': 'recSurN' },
            { 'data': 'recAddress' },
            { 'data': 'recMobile' },
            { 'data': 'recActive' }
        ]
    });
});