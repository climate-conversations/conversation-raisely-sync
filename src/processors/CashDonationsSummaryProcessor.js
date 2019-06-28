var GoogleSpreadsheet = require('google-spreadsheet');

async function getSpreadsheet(sheetTitle) {
    const document = new GoogleSpreadsheet('<spreadsheet key>');

    // OR, if you cannot save the file locally (like on heroku)
    var credentials = {
        client_email: 'yourserviceaccountemailhere@google.com',
        private_key: 'your long private key stuff here'
    };

    await new Promise((resolve, reject) => {
        document.useServiceAccountAuth(credentials, (err) => {
            if (err) reject(err);
            resolve();
        });
    });

    return new Promise((resolve, reject) => {
        document.getInfo((err, info) => {
            if (err) reject(err);
            const sheet = info.worksheets.find(sheet => sheet.title === sheetTitle);

            if (!sheet) reject(new Error(`Cannot find sheet with title "${sheetTitle}`));
            resolve(sheet);
          });
    });
}

function addConversation() {
    sheet.addRow({
        'column heading1': 'value',
        'column heading2': 'value',
    });
}

function updateRow() {
    sheet.getRows({
        offset: 1,
        limit: 20,
        orderby: 'col2'
      }, function( err, rows ){   
        console.log('Read '+rows.length+' rows');

        // the row is an object with keys set by the column headers
        rows[0].colname = 'new val';
        rows[0].save((err) => ...); // this is async
  
        // deleting a row
        rows[0].del((err) => { console.error(error) });  // this is async
  
        step();
      } 
}

module.exports = {
    addConversation,
}