/*---------------------------------------------------------
 * Copyright (C) 2019 Asindu Willfred Drileba. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';
import * as os from 'check-os';
import * as cmd from 'node-cmd';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	// Hover feature
	let hoverFeature = vscode.languages.registerHoverProvider('scilla', {
		provideHover(document, position) {
			const wordRange = document.getWordRangeAtPosition(position);
			const word = document.getText(wordRange);
			const map = {

				// keywords
				let: '**let:**  Give `f` the name `x` in the contract (`let x = f`). The binding of `x` to `f` is global and extends to the end of the contract.',
				contains: '**contains:**  In `contains m k` Is the key `k` associated with a value in the map `m`? Returns a `Bool`. The contains function is typically used in `library` functions.',
				delete: '**delete:** `delete m[k]` In-place remove operation, i.e., identical to `remove`, but without making a copy of `m`. `m` must refer to a contract field. Removal from nested maps is supported with the syntax `delete m[k1][k2][...]`. If any of the specified keys do not exist in the corresponding map, no action is taken. Note that in the case of a nested removal `delete m[k1][...][kn-1][kn]`, only the key-value association of `kn` is removed. The key-value bindings of `k` to `kn-1` will still exist.',
				put: '**put**: `put m k v` Insert a key `k` and a value `v` into a map `m`. Returns a new map which is a copy of the `m` but with `k` associated with `v`. The value of `m` is unchanged. The put function is typically used in library functions. Note that `put` makes a copy of `m` before inserting the key-value pair.',
				remove: '**remove m k:** `remove m k` Remove a key `k` and its associated value from the map `m`. Returns a new map which is a copy of `m` but with `k` being unassociated with a value. The value of m is unchanged. The remove function is typically used in library functions. Note that remove makes a copy of m before removing the key-value pair.',
				library: '**library:** The declarations of the contract\'s own library values and functions',
				import: '**import:** To use functions from the standard library in a contract, the relevant library file must be imported using the import declaration i.e `import ListUtils IntUtils`. The import declaration must occur immediately before the contract’s own library declaration ',
				contract: '**contract:** declares a contract i.e `contract: MyContract` ',
				event: '**event:** `event e` Emit a message `e` as an event. The following code emits an event with name `e_name`. `e = { _eventname : "e_name"; <entry>_2 ; <entry>_3 }; event e`',
				field: '**field:** `field vname_1 : vtype_1 = expr_1` Mutable variables represent the mutable state of the contract. They are also called fields. They are declared after the immutable variables, with each declaration prefixed with the keyword `field`',
				send: '**send:** `send msgs` Send a list of messages `msgs` where msgs can be `msg = { _tag : "setHello"; _recipient : contractAddress; _amount : Uint128 0; param : Uint32 0 };`',
				fun: '*fun:* `fun (x : T) => expr` A function that takes an input x of type T and returns the value to which expression expr evaluates.',
				transition: '**transition:** Transitions define the change in the state of the contract. These are defined with the keyword `transition` followed by the parameters to be passed. The definition ends with the `end` keyword. \n\n `transition foo (vname_1 : vtype_1, vname_2 : vtype_2, ...)	...	  end`',
				match: '**match:** `match` Matches a bound variable with patterns and evaluates the expression in that clause. i.e `match x with		| pattern_1 =>			  expression_1 ...				| pattern_2 =>				  expression_2 ...				| _ => (*Wildcard*)				  expression ...				end`',
				end: '**end:** closes a definition',
				with: '**with:** used with `match` i.e `match x with` ',
				builtin: '**builtin:** Perform built-in operations e.g `builtin add i1 i2`: Add integer values `i1` and `i2`. Returns an integer of the same type',

				//storage
				String: '`String`: literals in Scilla are expressed using a sequence of characters enclosed in double quotes. Variables can be declared by specifying using keyword `String`',
				Uint32: '`Uint32`: 32 bit integer type',
				Uint64: '`Uint64`: 64 bit integer type',
				Uint128: '`Uint128`: 128 bit integer type',
				Uint256: '`Uint256`: 256 bit integer type',
				Int32: '`Int32`: 32 bit integer type',
				Int64: '`Int64`: 64 bit integer type',
				Int128: '`Int128`: 128 bit integer type',
				Int256: '`Int256`: 256 bit integer type',
				Map: '`Map`: A value of type `Map kt vt` provides a key-value store where `kt` is the type of keys and `vt` is the type of values.',
				True: '`True`: Value of Boolean type',
				False: '`False`: Value of Boolean type',
				ByStr20: '`ByStr20`: Used to declare addreses. Represents a hexadecimal byte string of 20 bytes (40 hexadecimal characters). A `ByStr20` literal is prefixed with `0x`',
				ByStr32: '`ByStr32`: A hash in Scilla is declared using the data type `ByStr32`. A `ByStr32` represents a hexadecimal byte string of 32 bytes (64 hexadecimal characters). A `ByStr32` literal is prefixed with `0x`',
				ByStr64: '`ByStr64`: Used to declare digital signtures.',
				ByStr33: '`ByStr33`: Used to declare Schnorr public key',
				BNum: '`BNum`: Block numbers have a dedicated type `BNum` in Scilla. Variables of this type are specified with the keyword `BNum` followed by an integer value (for example `BNum 101`)',
				Option: '`Optional`: Optional values are specified using the type `Option t`	, where `t` is some type. The `Option` ADT has two constructors:	Some represents the presence of a value. The `Some` constructor takes one argument (the `value`, of type `t`). `None` represents the absence of a value. The `None` constructor takes no arguments.',
				None: '`None`: Constructor from `Option`. Represents the absence of a value. The `None` constructor takes no arguments.',
				Bool: '`Bool`: Boolean values are specified using the type Bool',
				Some: '`Some`: Constructor from `Option` takes one argument (the `value`, of type `t`)',
				List: 'Lists of values are specified using the type List t, where t is some type. The List ADT has two constructors: Nil represents an empty list. The Nil constructor takes no arguments.	Cons represents a non-empty list. The Cons constructor takes two arguments: The first element of the list (of type t), and another list (of type List t) representing the rest of the list.	',
				Cons: '`Cons`: Represents a non-empty list. The `Cons` constructor takes two arguments: The first element of the list (of type `t`), and another list (of type `List t`) representing the rest of the list.',
				Pair: 'Pairs of values are specified using the type `Pair t1 t2`, where `t1` and `t2` are types. The `Pair` ADT has one constructor:	`Pair` represents a pair of values. The Pair constructor takes two arguments, namely the two values of the pair, of types `t1` and `t2`, respectively.',
				type: '`type`: used to declare a type',
				scilla_version: '`scilla_version`: The contract starts with the declaration of `scilla_version`, which indicates which major Scilla version the contract uses.',
				Zero: '`Zero`: Represents the number `0`. The `Zero` constructor takes no arguments..',
				Succ: '`Succ`:  Represents the successor of another Peano number. The `Succ` constructor takes one argument (of type `Nat`) which represents the Peano number that is one less than the current number.',

				//operations
				eq: '_eq_: Equality operator `builtin eq i1 i2` Is i1 equal to i2? Returns a Bool',
				add: '_add_: In `builtin add i1 i2` Add integer values i1 and i2. Returns an integer of the same type.',
				sub: '_sub_: `builtin sub i1 i2` Subtract `i2` from `i1`. Returns an integer of the same type.',
				mul: '_mul_: `builtin mul i1 i2`, Integer product of `i1` and `i2`. Returns an integer of the same type.',
				div: '_div_: `builtin div i1 i2` Integer division of `i1` by `i2`. Returns an integer of the same type.',
				rem: '_rem_: `builtin rem i1 i2`: The remainder of integer division of `i1` by `i2`. Returns an integer of the same type.',
				lt: '_lt_: `builtin lt i1 i2` Is `i1` less than `i2`? Returns a `Bool`',
				blt: '_blt_: `blt b1 b2`, Is `b1` less than `b2`? Returns a `Bool`',
				in: '_in_: Used after the `let` keyword',
				substr: '_substr_: `builtin substr s1 i1 i2`, Extract the substring of `s1` of length `i2` starting from position `i1` with length. `i1` and `i2` must be of type `Uint32`. Character indices in strings start from `0`. Returns a `String`',
				sha256hash: '_sha256hash_: `builtin sha256hash x`, Convert `x` of Any type to its SHA256 hash. Returns a `ByStr32`',
				keccak256hash: '_keccak256hash_: `builtin keccak256hash x`, Convert `x` of Any type to its Keccak256 hash. Returns a `ByStr32`',
				ripemd160hash: '_ripemd160hash_: `builtin ripemd160hash x` Convert `x` of Any type to its RIPEMD-160 hash. Returns a `ByStr16`',
				to_byStr: '_to_byStr_: `builtin to_byStr x` Convert a hash `x` of type ByStrX (for some known X) to one of arbitrary length of type `ByStr`',
				to_nat: '_to_nat_: `builtin to_nat i1`, Convert a value of type `Uint32` to the equivalent value of type `Nat`',
				pow: '_pow_: `builtin pow i1 i2`, `i1` raised to the power of `i2`. Returns an integer of the same type as `i1`',
				to_uint256: '_to_uint256_: `builtin to_uint256 x`, Convert a hash x to the equivalent value of type `Uint256`. x must be of type ByStrX for some known X less than or equal to 32',
				to_uint32: '_to_uint32_: `builtin to_uint36 x`, Convert a hash `x` to the equivalent value of type `Uint32`. x must be of type ByStrX for some known X less than or equal to 32',
				to_uint64: '_to_uint64_: `builtin to_uint64 x`, Convert a hash x to the equivalent value of type `Uint64`. x must be of type ByStrX for some known X less than or equal to 64',
				to_uint128: '_to_uint128_: `builtin to_uint128 x`,  Convert a hash x to the equivalent value of type `Uint128`. x must be of type ByStrX for some known X less than or equal to 128',
				to_int256: '_to_int256_: `builtin to_int256 x,` Convert a hash x to the equivalent value of type `Uint256`. x must be of type ByStrX for some known X less than or equal to 32',
				to_int32: '_to_int32_: `builtin to_int32 x`, Convert a hash x to the equivalent value of type `Int32`. x must be of type ByStrX for some known X less than or equal to 32',
				to_int64: '_to_int64_: `builtin to_int64 x`, Convert a hash x to the equivalent value of type `Int64`. x must be of type ByStrX for some known X less than or equal to 64',
				to_list: '_to_list_: Equality operator `builtin eq i1 i2` Is i1 equal to i2? Returns a Bool',
				to_int128: '_to_int128_: `builtin to_int64 x`, Convert a hash x to the equivalent value of type `Int128`. x must be of type ByStrX for some known X less than or equal to 128',
				schnorr_verify: '_schnorr\_verify_: `builtin schnorr_verify pubk x sig` Verify a signature sig of type `ByStr64` against a hash `x` of type `ByStr32` with the Schnorr public key pubk of type `ByStr33`',
				concat: '_concat_: `concat x1 x2` Concatenate the hashes `x1` and `x2`. If x1 has type ByStrX and x2 has type ByStrY, then the result will have type `ByStr(X+Y)`',
			};
			return new vscode.Hover(map[word]);
		}

	});

	// Auto complete feature
	let autocompleteFeature = vscode.languages.registerCompletionItemProvider('scilla', {

		provideCompletionItems() {

			let completionWords = new Array;

			// keywords
			const letCompletion = new vscode.CompletionItem('let');
			const containsCompletion = new vscode.CompletionItem('contains');
			const deleteCompletion = new vscode.CompletionItem('delete');
			const putCompletion = new vscode.CompletionItem('put');
			const removeCompletion = new vscode.CompletionItem('remove');
			const libraryCompletion = new vscode.CompletionItem('library ');
			const importCompletion = new vscode.CompletionItem('import');
			const contractCompletion = new vscode.CompletionItem('contract');
			const eventCompletion = new vscode.CompletionItem('event');
			const fieldCompletion = new vscode.CompletionItem('field');
			const sendCompletion = new vscode.CompletionItem('send');
			const funCompletion = new vscode.CompletionItem('fun');
			const transitionCompletion = new vscode.CompletionItem('transition');
			const matchCompletion = new vscode.CompletionItem('match');
			const endCompletion = new vscode.CompletionItem('end');
			const withCompletion = new vscode.CompletionItem('with');
			const builtinCompletion = new vscode.CompletionItem('builtin');

			//Storage
			const stringCompletion = new vscode.CompletionItem('String');
			const uint32Completion = new vscode.CompletionItem('Uint32');
			const uint64Completion = new vscode.CompletionItem('Uint64');
			const uint128Completion = new vscode.CompletionItem('Uint128');
			const uint256Completion = new vscode.CompletionItem('Uint256');
			const int32Completion = new vscode.CompletionItem('Int32');
			const int64Completion = new vscode.CompletionItem('Int64');
			const int128Completion = new vscode.CompletionItem('Int128');
			const int256Completion = new vscode.CompletionItem('Int256');
			const mapCompletion = new vscode.CompletionItem('Map');
			const trueCompletion = new vscode.CompletionItem('True');
			const falseCompletion = new vscode.CompletionItem('False');
			const byStr20Completion = new vscode.CompletionItem('ByStr20');
			const byStr33Completion = new vscode.CompletionItem('ByStr33');
			const BNUMCompletion = new vscode.CompletionItem('BNUM');
			const optionCompletion = new vscode.CompletionItem('Option');
			const noneCompletion = new vscode.CompletionItem('None');
			const bystr64Completion = new vscode.CompletionItem('ByStr64');
			const boolCompletion = new vscode.CompletionItem('Bool');
			const someCompletion = new vscode.CompletionItem('Some');
			const listCompletion = new vscode.CompletionItem('List');
			const consCompletion = new vscode.CompletionItem('Cons');
			const pairCompletion = new vscode.CompletionItem('Pair');
			const typeCompletion = new vscode.CompletionItem('Type');
			const scillaCompletion = new vscode.CompletionItem('scilla_version');
			const zeroCompletion = new vscode.CompletionItem('Zero');
			const succCompletion = new vscode.CompletionItem('Succ');


			// operations
			const eqCompletion = new vscode.CompletionItem('eq');
			const addCompletion = new vscode.CompletionItem('add');
			const mulCompletion = new vscode.CompletionItem('mul');
			const divCompletion = new vscode.CompletionItem('div');
			const remCompletion = new vscode.CompletionItem('rem');
			const ltCompletion = new vscode.CompletionItem('lt');
			const bltCompletion = new vscode.CompletionItem('blt');
			const inCompletion = new vscode.CompletionItem('in');
			const substrCompletion = new vscode.CompletionItem('substr');
			const shaCompletion = new vscode.CompletionItem('sha256hash');
			const keccakCompletion = new vscode.CompletionItem('keccak256hash');
			const ripemdCompletion = new vscode.CompletionItem('ripemd160hash');
			const tobystrCompletion = new vscode.CompletionItem('to_byStr');
			const tonatCompletion = new vscode.CompletionItem('to_nat');
			const powCompletion = new vscode.CompletionItem('pow');
			const touint256Completion = new vscode.CompletionItem('to_uint256');
			const touint32Completion = new vscode.CompletionItem('to_uint32');
			const touint64Completion = new vscode.CompletionItem('to_uint64');
			const touint128Completion = new vscode.CompletionItem('to_uint128');
			const toint256Completion = new vscode.CompletionItem('to_int256');
			const toint32Completion = new vscode.CompletionItem('to_int32');
			const toint64Completion = new vscode.CompletionItem('to_int64');
			const toint128Completion = new vscode.CompletionItem('to_int128');
			const concatCompletion = new vscode.CompletionItem('to_concat');
			const schnorr_verify = new vscode.CompletionItem('schnorr_verify');
			const tolistCompletion = new vscode.CompletionItem('to_list');

			completionWords.push(
				//keywords
				letCompletion,
				containsCompletion,
				deleteCompletion,
				putCompletion,
				removeCompletion,
				libraryCompletion,
				importCompletion,
				contractCompletion,
				eventCompletion,
				fieldCompletion,
				sendCompletion,
				funCompletion,
				transitionCompletion,
				matchCompletion,
				endCompletion,
				withCompletion,
				builtinCompletion,

				//storage
				stringCompletion,
				uint32Completion,
				uint64Completion,
				uint128Completion,
				uint256Completion,
				int32Completion,
				int64Completion,
				int128Completion,
				int256Completion,
				mapCompletion,
				trueCompletion,
				falseCompletion,
				byStr20Completion,
				byStr33Completion,
				BNUMCompletion,
				optionCompletion,
				noneCompletion,
				bystr64Completion,
				boolCompletion,
				someCompletion,
				listCompletion,
				consCompletion,
				pairCompletion,
				typeCompletion,
				scillaCompletion,
				zeroCompletion,
				succCompletion,

				//operations
				eqCompletion,
				addCompletion,
				mulCompletion,
				divCompletion,
				remCompletion,
				ltCompletion,
				bltCompletion,
				inCompletion,
				substrCompletion,
				shaCompletion,
				keccakCompletion,
				ripemdCompletion,
				tobystrCompletion,
				tonatCompletion,
				powCompletion,
				touint256Completion,
				touint32Completion,
				touint64Completion,
				touint128Completion,
				toint256Completion,
				toint32Completion,
				toint64Completion,
				toint128Completion,
				concatCompletion,
				schnorr_verify,
				tolistCompletion
			);

			// return all completion items as array
			return completionWords;
		}
	});

	/*
	let linterFeature = vscode.commands.registerCommand('scilla.LintWithScillaChecker', () => {
	})
	*/

	const collection = vscode.languages.createDiagnosticCollection('scilla');
	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}
	var linterFeature = vscode.window.onDidChangeActiveTextEditor(e => updateDiagnostics(e.document, collection));

	context.subscriptions.push(hoverFeature, autocompleteFeature, linterFeature);
}




function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
	if (os.isWindows) {

		cmd.get(
			`scilla`,
			function (err, data, stderr) {

				if (data) {
					var content = JSON.parse(data);
					var numberOfErrMessages = content.warnings.length;

					var ScillaCollection = []

					// Loop over all diagnostic messages
					for (let errNumber = 0; errNumber < numberOfErrMessages; errNumber++) {

						var errMessage = content.warnings[errNumber].warning_message;
						var errLine = content.warnings[errNumber].start_location.line;
						var errColumn = content.warnings[errNumber].start_location.column;
						var errId = content.warnings[errNumber].warning_id;

						console.log(errLine, errColumn);

						var fullErrMessage = {
							code: errId, // feed the err id from scilla checker
							message: errMessage, // feed inn err message from scilla checker
							range: new vscode.Range(
								new vscode.Position(errLine, errColumn), // position where err starts
								new vscode.Position(errLine + 1, errColumn + 1)), // position where err ends
							severity: vscode.DiagnosticSeverity.Warning, // label these as warnings
							source: 'Scilla Checker (linter)', // label this as err from scilla ckecker
							relatedInformation: [
								new vscode.DiagnosticRelatedInformation(
									new vscode.Location(
										document.uri,
										new vscode.Range(
											new vscode.Position(errLine, errColumn),
											new vscode.Position(errLine + 1, errColumn + 1)
										)),
									errMessage)

							]
						}

						ScillaCollection.push(fullErrMessage) // create an array of all warnings

						// only create this diagnostic for scilla files
						if (document && path.extname(document.uri.fsPath) === '.scilla') {
							collection.set(document.uri, ScillaCollection); //send list of errs to VSCode

						} else {
							collection.clear();
						}

					}

				} else {

					// consuming data from syntax Error
					let fileNameRgx = /\w*(?=\.scilla.)/g;
					let LineRgx = /\d+/g;
					let errTypeRgx = /\w+/g;

					let standardErr = {
						"filename": fileNameRgx.exec(stderr)[0] + ".scilla",
						"errline": stderr.match(LineRgx)[0],
						"errcolumn": stderr.match(LineRgx)[1],
						"errtype": stderr.match(errTypeRgx)[5] + " Error"
					}

					if (document && path.extname(document.uri.fsPath) === '.scilla') {
						collection.set(document.uri, [{
							code: '0',
							message: standardErr.errtype,
							range: new vscode.Range(new vscode.Position(standardErr.errline, standardErr.errcolumn), new vscode.Position(standardErr.errline+1, standardErr.errcolumn+1)),
							severity: vscode.DiagnosticSeverity.Error,
							source: 'Scilla Checker (linter)',
							relatedInformation: []
						}]);
					} else {
						collection.clear();
					}

					vscode.window.showInformationMessage(standardErr.errtype);
				}

			}
		);

	} else {
		vscode.window.showInformationMessage('Install WSL to enable  linting & cashflow analysis');
	}
}

// this method is called when your extension is deactivated
export function deactivate() {
}
