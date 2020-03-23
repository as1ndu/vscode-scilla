import * as vscode from 'vscode';
import * as path from 'path';
import { Base64 } from 'js-base64';
import * as axios from 'axios';


// Diagnostic data
var content;

export function remoteDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {

 // console.log(`Gas limit is ${JSON.stringify(vscode.workspace.getConfiguration('scilla'))}`)

  // get raw scilla file & encode it to base64
  let scillaText = document.getText().normalize() // get all the Scilla code
  //let unicodeScillaFile = utf8.decode(scillaText); // convert string to bytes
  let encodedScillaFile = Base64.encode(scillaText).replace(/\+/g, '-'); // encoded scilla file

  //console.log(`\n\n\n${encodedScillaFile} \n\n ${Base64.decode(encodedScillaFile)}`)

  let scillaFileName = path.basename(document.fileName)
  let gasLimit = vscode.workspace.getConfiguration('scilla').gasLimit

  axios.default.post(`http://18.225.9.157:5000/debug?filename=${scillaFileName}&gas_limit=${gasLimit}&source=${encodedScillaFile}&hash=456755645434232`).then((res) => {
    //console.log(`Status ${res.status}, ${JSON.stringify(res.data)}, ${res.headers}, ${res.request}, ${res.config}`);
    content = res.data

    //console.log(JSON.stringify(content))// Check if remote debugging is on
    let remoteDebuggingOn = vscode.workspace.getConfiguration('scilla').remoteDebugging

    if (remoteDebuggingOn) {

      collection.clear(); //show one err at a time

      // convert  absolute windows path to linux path
      //var absolutepath = path.dirname(document.uri.fsPath).replace(":", "").replace(/\\/g, "/") + "/";

      //console.log(absolutepath + path.basename(document.uri.fsPath));

      //let data = "{"warnings": [ { "end_location": {  "column": 0,   "file": "",  "line": 0 }, "start_location": {  "column": 0, "file": "",  "line": 0    }, "warning_id": 1, "warning_message": "No transition in contract HelloWorld contains an accept statement\n"   }  ]}"
      /*
          console.log(`
          Number of ${content.error.length} Errors &  ${content.warnings.length} Warnings
          Document url ${document.uri}
          `)
          */

      var ScillaCollection = []

     // show gas usage
      var showGasUsage = vscode.workspace.getConfiguration('scilla').gasReport
      if (content.gas_usage && showGasUsage){
        vscode.window.showInformationMessage(`${content.gas_usage} of Gas remaining`) 
      }

      // Render Warnings
      if (content.warnings.length > 0) {
        //JSON.parse(data);
        let numberOfWarningMessages = content.warnings.length;

        // console.log(`${content.toString()}`)

        // let ScillaCollection = []

        // loop over all diagnostic messages
        for (let WarningNumber = 0; WarningNumber < numberOfWarningMessages; WarningNumber++) {

          let WarningMessage = content.warnings[WarningNumber].warning_message;
          let StartWarningLine = content.warnings[WarningNumber].start_location.line;
          let StartWarningColumn = content.warnings[WarningNumber].start_location.column;
          let EndWarningLine = content.warnings[WarningNumber].start_location.line;
          let EndWarningColumn = content.warnings[WarningNumber].start_location.column;
          let WarningId = content.warnings[WarningNumber].warning_id;

          //console.log(errMessage, errLine, errLine);

          let fullWarningMessage = {
            code: WarningId, // feed the err id from scilla checker
            message: WarningMessage, // feed inn err message from scilla checker
            range: new vscode.Range(
              new vscode.Position(StartWarningLine, StartWarningColumn), // position where err starts
              new vscode.Position(EndWarningLine, EndWarningColumn)), // position where err ends
            severity: vscode.DiagnosticSeverity.Warning, // label these as warnings
            source: 'scilla-checker (Warning)', // label this as err from scilla ckecker
            relatedInformation: [
              new vscode.DiagnosticRelatedInformation(
                new vscode.Location(
                  document.uri,
                  new vscode.Range(
                    new vscode.Position(StartWarningLine, StartWarningColumn), // position where err starts
                    new vscode.Position(StartWarningLine, StartWarningColumn) // position where err ends
                  )),
                WarningMessage)

            ]
          }

          ScillaCollection.push(fullWarningMessage) // create an array of all warnings

          // only create this diagnostic for scilla files
          if (document && path.extname(document.uri.fsPath) === '.scilla') {
            collection.set(document.uri, ScillaCollection); // send list of errs to VSCode
            // vscode.window.showInformationMessage(errMessage);

          } else {
            collection.clear();
          }
        }

      }


      // Render Errors 
      if (content.error.length > 0) {
        //JSON.parse(data);
        let numberOfErrMessages = content.error.length;

        //console.log(`${content.toString()}`)

        //let ScillaCollection = []

        // loop over all diagnostic messages
        for (let ErrNumber = 0; ErrNumber < numberOfErrMessages; ErrNumber++) {

          let ErrMessage = content.error[ErrNumber].error_message;
          let StartErrLine = content.error[ErrNumber].start_location.line;
          let StartErrColumn = content.error[ErrNumber].start_location.column;

          let EndErrLine = content.error[ErrNumber].start_location.line;
          let EndErrColumn = content.error[ErrNumber].start_location.column;
          var ErrId = "1"

          //content.error[ErrNumber].warning_id;

          //console.log(errMessage, errLine, errLine);

          let fullErrMessage = {
            code: ErrId, // feed the err id from scilla checker
            message: ErrMessage, // feed inn err message from scilla checker
            range: new vscode.Range(
              new vscode.Position(StartErrLine, StartErrColumn), // position where err starts
              new vscode.Position(EndErrLine, EndErrColumn)), // position where err ends
            severity: vscode.DiagnosticSeverity.Error, // label these as warnings
            source: 'scilla-checker (Error)', // label this as err from scilla ckecker
            relatedInformation: [
              new vscode.DiagnosticRelatedInformation(
                new vscode.Location(
                  document.uri,
                  new vscode.Range(
                    new vscode.Position(StartErrLine - 1, StartErrColumn - 1), // position where err starts
                    new vscode.Position(StartErrLine, StartErrColumn) // position where err ends
                  )),
                ErrMessage)

            ]
          }

          ScillaCollection.push(fullErrMessage) // create an array of all warnings

          // only create this diagnostic for scilla files
          if (document && path.extname(document.uri.fsPath) === '.scilla') {
            collection.set(document.uri, ScillaCollection); // send list of errs to VSCode
            // vscode.window.showInformationMessage(errMessage);

          } else {
            collection.clear();
          }
        }

      }


      // Render Type info
      if (content.type_info.length > 0) {

        //console.log(`${content.type_info.length} Types detected`)
        //JSON.parse(data);
        let numberOfTypeMessages = content.type_info.length;

        //console.log(`${content.toString()}`)

        //let ScillaCollection = []

        // loop over all diagnostic messages
        for (let TypeNumber = 0; TypeNumber < numberOfTypeMessages; TypeNumber++) {

          //console.log(`${TypeNumber}th Type is being computed`)

          let TypeMessage = content.type_info[TypeNumber].type;
          let StartTypeLine = content.type_info[TypeNumber].start_location.line;
          let StartTypeColumn = content.type_info[TypeNumber].start_location.column;

          let EndTypeLine = content.type_info[TypeNumber].end_location.line;
          let EndTypeColumn = content.type_info[TypeNumber].end_location.column;
          let TypeId = content.type_info[TypeNumber].vname;

          // console.log(errMessage, errLine, errLine);

          let fullTypeMessage = {
            code: TypeId, // feed the err id from scilla checker
            message: TypeMessage, // feed in type message from scilla checker
            range: new vscode.Range(
              new vscode.Position(StartTypeLine - 1, StartTypeColumn - 1), // position where err starts
              new vscode.Position(EndTypeLine, EndTypeColumn)), // position where err ends
            severity: vscode.DiagnosticSeverity.Hint, // label these as warnings
            source: 'scilla-checker (Type Infomation)', // label this as err from scilla ckecker
            relatedInformation: [
              new vscode.DiagnosticRelatedInformation(
                new vscode.Location(
                  document.uri,
                  new vscode.Range(
                    new vscode.Position(StartTypeLine - 1, StartTypeColumn - 1), // position where err starts
                    new vscode.Position(EndTypeLine, EndTypeColumn) // position where err ends
                  )),
                TypeMessage)

            ]
          }

          ScillaCollection.push(fullTypeMessage)

          // only create this diagnostic for scilla files
          if (document && path.extname(document.uri.fsPath) === '.scilla') {
            collection.set(document.uri, ScillaCollection); // send list of errs to VSCode
            // vscode.window.showInformationMessage(errMessage);

          } else {
            collection.clear();
          }
        }

      }

    }

  }).catch(
    (err) => {
      // err message
    }
  );

  //console.log(`Remote messages ${remoteM}`)

  //console.log(`File name ${scillaFileName}\nGas Limit is ${gasLimit}`)

  /*
  content = {
    "filename": "test.scilla",
    "gas_limit": "8000",
    "gas_usage": "7350",

    "cash_flow_analysis": {
      "ADT constructors": [],
      "State variables": [
        {
          "field": "owner",
          "tag": "NotMoney"
        },
        {
          "field": "welcome_msg",
          "tag": "NoInfo"
        }
      ]
    },

    "type_info": [
      {
        "end_location": {
          "column": 12,
          "file": "test.scilla",
          "line": 12
        },
        "start_location": {
          "column": 5,
          "file": "test.scilla",
          "line": 12
        },
        "type": "Message -> List (Message)",
        "vname": "one_msg"
      },
      {
        "end_location": {
          "column": 11,
          "file": "test.scilla",
          "line": 13
        },
        "start_location": {
          "column": 8,
          "file": "test.scilla",
          "line": 13
        },
        "type": "Message",
        "vname": "msg"
      }
    ],

    "error": [
      {
        "error_message": "After specifying a Scilla version number, either imports, a library or contract is expected.\n",
        "start_location": { "file": "test.scilla", "line": 7, "column": 7 },
        "end_location": { "file": "", "line": 0, "column": 0 }
      },

      {
        "error_message": "After specifying a Scilla version number, either imports, a library or contract is expected.\n",
        "start_location": { "file": "test.scilla", "line": 7, "column": 7 },
        "end_location": { "file": "", "line": 0, "column": 0 }
      }
    ],

    "warnings": [
      {
        "end_location": {
          "column": 5,
          "file": "",
          "line": 5
        },
        "start_location": {
          "column": 5,
          "file": "",
          "line": 5
        },
        "warning_id": 1,
        "warning_message": "Warning message 1"
      },
      {
        "end_location": {
          "column": 12,
          "file": "",
          "line": 12
        },
        "start_location": {
          "column": 12,
          "file": "",
          "line": 12
        },
        "warning_id": 2,
        "warning_message": "Warning message 2"
      }
    ]
  }
  */


}


export function remoteCFA(document: vscode.TextDocument) {

  // get raw scilla file & encode it to base64
  let scillaText = document.getText().normalize() // get all the Scilla code
  //let unicodeScillaFile = utf8.decode(scillaText); // convert string to bytes
  let encodedScillaFile = Base64.encode(scillaText).replace(/\+/g, '-'); // encoded scilla file

  console.log(`\n\n\n${encodedScillaFile} \n\n ${Base64.decode(encodedScillaFile)}`)

  let scillaFileName = path.basename(document.fileName)
  let gasLimit = vscode.workspace.getConfiguration('scilla').gasLimit

  axios.default.post(`http://18.225.9.157:5000/debug?filename=${scillaFileName}&gas_limit=${gasLimit}&source=${encodedScillaFile}&hash=456755645434232`).then((res) => {
    //console.log(`Status ${res.status}, ${JSON.stringify(res.data)}, ${res.headers}, ${res.request}, ${res.config}`);
    content = res.data

    // Cashflow analysis
    if (content.cash_flow_analysis["State variables"].length > 0) {
      var panel = vscode.window.createWebviewPanel(
        'scilla',
        'Cash Flow Analyser',
        vscode.ViewColumn.One,
        {}
      );

      console.log('Parsing data from scilla-checker');
      //var content = JSON.parse(data);
      var CFstateVariables = content.cash_flow_analysis["State variables"];
      var CFadtConstructors = content.cash_flow_analysis["ADT constructors"];

      //console.log(CFstateVariables);
      var analysisTableRows = '';

      console.log('creating table rows for from cashflow analysis');

      for (let index = 0; index < CFstateVariables.length; index++) {

        let cfVariable = CFstateVariables[index]['field'];
        let cfTag = CFstateVariables[index]['tag'];

        var analysisTableRow = `
            <tr>
              <td>${cfVariable}</td>
              <td>${cfTag}</td>
            </tr>`

        var analysisTableRows = analysisTableRows.concat(analysisTableRow)
        //console.log(analysisTableRows)
      }


      //console.log(`Finnished Analysing: ${CFstateVariables.length} State variables  &  ${CFadtConstructors.length} ADT Constructors`);
      var CFstateVariablesLength = CFstateVariables.length;


      if (CFstateVariables.length == 0) {
        CFstateVariables = [{
          "field": "none",
          "tag": "none"
        }]

        CFstateVariablesLength = 0;
      }

      //console.log('Rendering WebView');



    }

    panel.webview.html = getWebviewContent(CFstateVariablesLength, CFadtConstructors, analysisTableRows);

    function getWebviewContent(CFstateVariablesLength, adtconstructors, tableRows) {
      return `
    <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Scilla CashFlow Analysis</title>
      <style>
          table {
              font-family: arial, sans-serif;
              border-collapse: collapse;
              width: 100%;
          }
  
          td,
          th {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
          }
  
          tr:nth-child(odd) {
              background-color: #000000;
              color: #dddddd;
          }
  
          tr:nth-child(even) {
              background-color: #dddddd;
              color: #000000;
          }
  
          body {
              background-image: url("data:image/png;base64,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");
              background-repeat: repeat;
              background-color: #000000;
              padding-left: 5%;
              padding-right: 10%;
          }
  
          h1 {
              background-color: #00000071;
              color: #dddddd;
          }
  
          h3 {
              color: #dddddd;
              background-color: #000000;
          }
  
          p,
          ol,
          details {
              color: #dddddd;
              background-color: #000000;
              max-width: 100%;
          }
  
          li {
              color: teal;
          }
  
          b {
              font-size: large;
          }
  
          a {
              color: teal;
          }
      </style>
  </head>
  
  <body>
      <h1>
          <img src="data:image/png;base64,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" height="64" width="64">
          <br />
          Scilla CashFlow Analysis.
      </h1>
  
      <hr />
  
      <br />
  
      <center>
          <h3>Analysed: ${CFstateVariablesLength} State variables**</h3>
  
          <br />
  
          <table>
              <tr>
                  <th>Field</th>
                  <th>Tag</th>
              </tr>
  
              ${tableRows}
  
          </table>
  
      </center>
  
      <br />
  
  
      <p>
          The cashflow analysis phase analyzes the usage of a contract’s variables and fields, and attempts to
          determine
          which fields are used to represent (native) blockchain money. Each contract field is annotated with a tag
          indicating the field’s usage.
      </p>
  
  
      <ol>
          <h3>The analysis uses the following set of tags:</h3>
          <li>
              <b>❔ No Information:</b>
              <label>
                  <details>
                      No information has been gathered about the variable. This sometimes (but not always) indicates that
                      the variable is not being used, indicating a potential bug.
                  </details>
              </label>
          </li>
          <li>
              <b>💰 Money:</b>
              <label>
                  <details>
                      The variable represents money.
                  </details>
              </label>
          </li>
          <li>
              <b>💿 Not Money:</b>
              <label>
                  <details>
                      The variable represents something other than money.
                  </details>
              </label>
          </li>
          <li>
              <b>🐞 Inconsistent:</b>
              <label>
                  <details>
                      The variable has been used to represent both money and not money. Inconsistent usage indicates a
                      bug.
                  </details>
              </label>
          </li>
          <li>
              <b>🎲 Map t (where t is a tag):</b>
              <label>
                  <details>
                      The variable represents a map or a function whose co-domain is tagged with t. Hence, when performing
                      a lookup in the map, or when applying a function on the values stored in the map, the result is
                      tagged with t. Keys of maps are assumed to always be Not money. Using a variable as a function
                      parameter does not give rise to a tag.
                  </details>
              </label>
          </li>
  
          <li>
              <b>💭 Option t (where t is a tag):</b>
              <label>
                  <details>
                      The variable represents an option value, which, if it does not have the value None, contains the
                      value Some x where x has tag t.
                  </details>
              </label>
          </li>
          <li>
              <b>🌓 Pair t1 t2 (where t1 and t2 are tags):</b>
              <label>
                  <details>
                      The variable represents a pair of values with tags t1 and t2, respectively.
                  </details>
              </label>
          </li>
      </ol>
  
  
  
      <p>
          **The resulting tags are an approximation based on the usage of each contract field, and the usage of local
          variables in the contract. The tags are not guaranteed to be accurate, but are intended as a tool to help
          the
          contract developer use her fields in the intended manner.
  
          <a href="https://scilla.readthedocs.io/en/latest/scilla-checker.html#cashflow-analysis">Learn more about
              Scilla's cashflow analysis</a>
      </p>
  
  </body>
  
  </html>
    `;
    }

  })

    
 

  }




