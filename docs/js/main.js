////////////////////////////////////////////// LOGIN

var tries = 0;
var a;
var b;

$('#login-button').click(function() {
  tries += 1;

  if (tries >= 4) {
    window.open("https://www.metro.net/","_self");
  }

  var u = $('#login-user-input').val();
  var p = $('#login-pw-input').val();

  if ((u == a) && (p == b)) {
    $('#login-box').addClass('d-none');
  } else {
    $('#num-tries').html(`<span style="color: red">Incorrect login. ${4 - tries} attempts left.</span>`)
  }
});

function getDataSheet(in_sheet) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: in_sheet,
    range: 'DO NOT TOUCH: Full Database!A1:DK',
  }).then(function(response) {
    var values = response.result.values;
    var headers = values[1];

    for (var i = 2; i < values.length; i++){
      var currentStatus = values[i][headers.indexOf("Status")];
    }
  })
}

var c_i = '1096764346798-03u4s3fphjvgmpbpr3hf7gags9tt4vgp.apps.googleusercontent.com';
var a_k = 'AIzaSyAPREfLoSbpyVWzcUGbvtLuPUQH02ZnWJk';

var dd = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

var sc = "https://www.googleapis.com/auth/spreadsheets.readonly";

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: a_k,
    clientId: c_i,
    discoveryDocs: dd,
    scope: sc
  }).then(function() {
    getDataSheet('1eqGuqlpaG6ocv8FCozkmNf_diPTmP41hjerZUfOw3TU');
  });
}

handleClientLoad();