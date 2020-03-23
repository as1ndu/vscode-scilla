import * as cmd from 'node-cmd';
import * as path from 'path';
import * as vscode from 'vscode';

var binariesPath = "";
var STDLIB = "";
var gasLimit = "";
var absolutepath = "";


export function localDiagnostics(document: vscode.TextDocument) {
    cmd.get(
        `${binariesPath + '/scilla-checker' } -libdir ${STDLIB} -gaslimit ${gasLimit}   ${absolutepath + path.basename(document.uri.fsPath)} -jsonerrors`,
        function (err, data, stderr) {

            if (err) {
                console.log('Error here')
                
            }

            if (data){
                console.log('here is the data')

            }

            if (stderr) {
                console.log('nothing found!')
                
            }
    
    
        }
    );
    return 'done'
}