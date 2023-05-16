var overallData = [];
var translationalData = [];
var dataScienceData = [];
var rdMgmtData = [];
var generalAdminData = [];
var expensesData = [];

let tokenClient;
let gapiInited = false;
let gisInited = false;

const CLIENT_ID = '596568994401-uj6qe9u0ofai8r4ek05rlnv160abstl6.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAL99ULTH3CSKC-FkWnCVAKGpY2xVK2x-w';

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

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
    getDataSheet('1ZaF2VThY98jHmbxOssn_Qq5flm7dn_uvNh7Abp7sI9Q', 'Overall!A1:AJ', overallData);
    // getDataSheet('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI', 'Translational Science!A1:P', translationalData);
    // getDataSheet('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI', 'Data Science!A1:P', dataScienceData);
    // getDataSheet('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI', 'R&D Management!A1:P', rdMgmtData);
    // getDataSheet('1N57uC28-1rR8z9QSg11tIQdARCXGeqjS8ii4JEaShGI', 'Expenses!A1:I', expensesData);
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

function getDataSheet(in_sheet, in_sheet_name, in_array) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: in_sheet,
    range: in_sheet_name,
  }).then(function(response) {
    var values = response.result.values;
    var categories = Object.keys(categoriesDict);
    var monthFields = ['', '', '', 'Mth 1', 'Mth 2', 'Mth 3', 'Q1', 'Mth 4', 'Mth 5', 'Mth 6', 'Q2', 'Mth 7', 'Mth 8', 'Mth 9', 'Q3', 'Mth 10', 'Mth 11', 'Mth 12', 'Q4', 'Total', 'Mth 1', 'Mth 2', 'Mth 3', 'Q1', 'Mth 4', 'Mth 5', 'Mth 6', 'Q2', 'Mth 7', 'Mth 8', 'Mth 9', 'Q3', 'Mth 10', 'Mth 11', 'Mth 12', 'Q4'];
    
    for (var i = 1; i < values.length; i++){
      if (values[i].length > 0){
        if (categories.indexOf(values[i][1]) > -1) {
          for (var j = 0; j < monthFields.length; j++) {
            if (monthFields[j].indexOf('Mth') > -1) {
              var currentDict = {};

              var currentCategory = values[i][1];
              currentDict['category'] = currentCategory;
              var currentAmount = values[i][j];
              var currentMonth = monthFields[j].replace('Mth ', '');
              if (j < 18) {
                var currentYear = 2023;
              } else {
                var currentYear = 2024;
              }

              currentDict['date'] = `${currentMonth}/1/${currentYear}`;
              currentDict['amount'] = currentAmount;
              in_array.push(currentDict);
            }
          }
        }
      }
    }
    createCharts();
  });
};