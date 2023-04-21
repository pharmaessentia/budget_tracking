////////////////////////////////////////////// LOGIN

var tries = 0;
var a;
var b;

var overallData = [];
var translationalData = [];
var dataScienceData = [];
var rdMgmtData = [];
var generalAdminData = [];
var expensesData = [];

var overallDict = {};
var translationalDict = {};
var dataScienceDict = {};
var rdMgmtDict = {};
var generalAdminDict = {};
var expensesDict = {};

const CLIENT_ID = '748933621985-hp6mlbfi9kgtt60nav8nh4lufhlhear1.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAPREfLoSbpyVWzcUGbvtLuPUQH02ZnWJk';

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

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

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
function initializeGapiClient() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  }).then(function() {

    getCreds('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI');
    getDataSheet('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI', 'Overall!A1:G', overallData);
    getDataSheet('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI', 'Translational Science!A1:P', translationalData);
    getDataSheet('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI', 'Data Science!A1:P', dataScienceData);
    getDataSheet('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI', 'R&D Management!A1:P', rdMgmtData);
    getDataSheet('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI', 'Expenses!A1:I', expensesData);
  });
  gapiInited = true;
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
}

function getCreds(in_sheet) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: in_sheet,
    range: 'c!A1:B',
  }).then(function(response) {
    var values = response.result.values;

    a = values[0][0];
    b = values[0][1];

  });
}

function getDataSheet(in_sheet, in_sheet_name, in_data_array) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: in_sheet,
    range: in_sheet_name,
  }).then(function(response) {
    var values = response.result.values;

    for (var i = 1; i < values.length; i++){
      var currentRow = [];
      for (var j = 0; j < values[i].length; j++) {
        currentRow.push(values[i][j]);
      }
      in_data_array.push(currentRow);
    }
  })
}

function jsonifyArray(in_array, in_json_dict) {
  for (var i; i < in_array.length; i++) {
    if (in_array[i][0] == '' && in_array[i][2] == '') {
      // in_json_dict[in_array[i][1]] = [Number(in_array[i][3]), Number(in_array[i][4]), Number(in_array[i][5]), Number(in_array[i][6])]
      in_json_dict[in_array[i][1]] = i;
    }
  }
}

jsonifyArray(overallData, overallDict);

const breakdownChart = new dc.PieChart('#breakdownChartId');

// d3.json(overallData).then(data => {

// });