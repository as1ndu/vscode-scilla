/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// hover feature
	let hoverFeature = vscode.languages.registerHoverProvider('scilla', {
		provideHover(document, position) {
			const wordRange = document.getWordRangeAtPosition(position);
			const word = document.getText(wordRange);
			const map = {

				// keywords
				let: '',
				contains: '',
				delete: '',
				put: '',
				remove: '',
				library: '',
				import: '',
				contract: '',
				event: '',
				field: '',
				send: '',
				fun: '',
				transition: '',
				match: '',
				end: '',
				with: '',
				builtin: '',

				//storage
				String: '',
				Uint32: '',
				Uint64: '',
				Uint128: '',
				Uint256: '',
				Int32: '',
				Int64: '',
				Int128: '',
				Int256: '',
				Map: '',
				True: '',
				False: '',
				ByStr20: '',
				ByStr32: '',
				ByStr64: '',
				ByStr33: '',
				BNum: '',
				Option: '',
				None: '',
				Bool: '',
				Some: '',
				List: '',
				Cons: '',
				Pair: '',
				type: '',
				scilla_version: '',
				Zero: '',
				Succ: '',

				//operations


			};
			return new vscode.Hover(map[word]);
		}

	});


	let autocompleteFeature = vscode.languages.registerCompletionItemProvider('scilla', {

		provideCompletionItems(document, position, token, context) {

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
			const uint128Completion = new vscode.CompletionItem('Uint64');
			const uint256Completion = new vscode.CompletionItem('Uint64');
			const int32Completion = new vscode.CompletionItem('Int32');
			const int64Completion = new vscode.CompletionItem('Int64');
			const int128Completion = new vscode.CompletionItem('Int64');
			const int256Completion = new vscode.CompletionItem('Int64');
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
			const subtrCompletion = new vscode.CompletionItem('subtr');
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
				subtrCompletion,
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
	context.subscriptions.push(hoverFeature, autocompleteFeature);
}
