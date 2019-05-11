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
				eq: '',
				add: '',
				sub: '',
				mul: '',
				div: '',
				rem: '',
				lt: '',
				blt: '',
				in: '',
				substr: '',
				sha256hash: '',
				keccak256hash: '',
				ripemd160hash: '',
				to_byStr: '',
				to_nat: '',
				pow: '',
				to_uint256: '',
				to_uint32: '',
				to_uint64: '',
				to_uint128: '',
				to_int256: '',
				to_int32: '',
				to_int64: '',
				to_list: '',
				to_int128: '',
				schnorr_verify: '',
				concat: '',				
			};
			return new vscode.Hover(map[word]);
		}

	});
	context.subscriptions.push(hoverFeature);
}
