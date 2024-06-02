let CLIENT_ID = 'YOUR_CLIENT_ID';
let API_KEY = 'YOUR_API_KEY';
let DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
let SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        console.error(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function listMajors() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Sheet1!A1:E10',
    }).then(function(response) {
        let range = response.result;
        if (range.values.length > 0) {
            let table = document.createElement('table');
            let thead = document.createElement('thead');
            let tbody = document.createElement('tbody');
            table.appendChild(thead);
            table.appendChild(tbody);

            range.values.forEach((row, rowIndex) => {
                let tr = document.createElement('tr');
                row.forEach(cell => {
                    let td = document.createElement(rowIndex === 0 ? 'th' : 'td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                if (rowIndex === 0) {
                    thead.appendChild(tr);
                } else {
                    tbody.appendChild(tr);
                }
            });
            document.getElementById('content').appendChild(table);
        } else {
            document.getElementById('content').innerText = 'No data found.';
        }
    }, function(response) {
        document.getElementById('content').innerText = 'Error: ' + response.result.error.message;
    });
}

document.addEventListener('DOMContentLoaded', handleClientLoad);
