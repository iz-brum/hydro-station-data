// src/api/googleSheetsService.js

import { gapi } from 'gapi-script';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

export const initClient = () => {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
      scope: SCOPES,
    }).then(() => {
      console.log('GAPI client initialized.');
    });
  });
};

export const signIn = () => {
  gapi.auth2.getAuthInstance().signIn();
};

export const appendDataToSheet = async (range, values) => {
  const response = await gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'RAW',
    resource: { values },
  });
  return response;
};
