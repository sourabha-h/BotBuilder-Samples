/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Type definitions for Visual Studio Code 1.46
// Project: https://github.com/microsoft/vscode
// Definitions by: Visual Studio Code Team, Microsoft <https://github.com/Microsoft>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
<<<<<<< HEAD
<<<<<<< HEAD
	CompletionItem,
=======
>>>>>>> 8f776b02b8003c84c4a871704de82c96b05e98b3
=======
>>>>>>> 94336950cf32e49b58ee0e5b488913f397b40137
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	Files,
	HoverParams,
	DefinitionParams,
	ExecuteCommandParams,
	SignatureHelpParams,
	WorkspaceFolder,
	DidChangeWatchedFilesNotification,
	DidChangeWatchedFilesRegistrationOptions,
	FileChangeType
} from 'vscode-languageserver';

import * as completion from './providers/completion';
import * as diagnostics from './providers/diagnostics';
import * as definition from './providers/definition';
import * as hover from './providers/hover';
import * as keyBinding from './providers/keyBinding';
import * as signature from './providers/signature';

import * as util from './util';
import { TemplatesStatus } from './templatesStatus';
import { TextDocument } from 'vscode-languageserver-textdocument';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. 
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
let workspaceFolders: WorkspaceFolder[] | null | undefined;

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
<<<<<<< HEAD
<<<<<<< HEAD
let hasDiagnosticRelatedInformationCapability = false;
=======
>>>>>>> 8f776b02b8003c84c4a871704de82c96b05e98b3
=======
>>>>>>> 94336950cf32e49b58ee0e5b488913f397b40137
let hasDidChangeWatchedFilesCapability = false;


connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;
	workspaceFolders = params.workspaceFolders;
	util.triggerLGFileFinder(workspaceFolders!);

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
<<<<<<< HEAD
<<<<<<< HEAD
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);
=======
>>>>>>> 8f776b02b8003c84c4a871704de82c96b05e98b3
=======
>>>>>>> 94336950cf32e49b58ee0e5b488913f397b40137
	hasDidChangeWatchedFilesCapability = !!(
		capabilities.workspace && !! capabilities.workspace.didChangeWatchedFiles?.dynamicRegistration
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				// resolveProvider: true,
				triggerCharacters: [ '{', '(', '[', '.', '\n', '#', '=', ',', ' ' ]
			},
			hoverProvider: true,
			definitionProvider: true,
			executeCommandProvider: {
				commands: ['lg.extension.onEnterKey']
			},
			signatureHelpProvider: {
				triggerCharacters: ['(', ',']
			},
			workspace: {
				workspaceFolders: {
					supported: true
				}
			}
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}

	if(hasDidChangeWatchedFilesCapability) {	
		const option : DidChangeWatchedFilesRegistrationOptions = {watchers: [{globPattern: '**/*.lg'}]};
		connection.client.register(DidChangeWatchedFilesNotification.type, option);
	}

	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			workspaceFolders = workspaceFolders?.filter(workspaceFolder => !_event.removed.includes(workspaceFolder));
			_event.added.forEach(folderAdded => workspaceFolders?.push(folderAdded));
			util.triggerLGFileFinder(workspaceFolders!);
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface LgSettings {
	maxNumberOfProblems: number;
}

<<<<<<< HEAD
<<<<<<< HEAD
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: LgSettings = { maxNumberOfProblems: 1000 };
let globalSettings: LgSettings = defaultSettings;

=======
>>>>>>> 8f776b02b8003c84c4a871704de82c96b05e98b3
=======
>>>>>>> 94336950cf32e49b58ee0e5b488913f397b40137
// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<LgSettings>> = new Map();


<<<<<<< HEAD
<<<<<<< HEAD
connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <LgSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
=======
=======
>>>>>>> 94336950cf32e49b58ee0e5b488913f397b40137
connection.onDidChangeConfiguration(() => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
<<<<<<< HEAD
>>>>>>> 8f776b02b8003c84c4a871704de82c96b05e98b3
=======
>>>>>>> 94336950cf32e49b58ee0e5b488913f397b40137
	}

	// To update templatestatus with only open text documents
	util.triggerLGFileFinder(workspaceFolders!); 

	// Revalidate all open text documents
	documents.all().forEach(document => diagnostics.updateDiagnostics(document, connection));
});

// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition: TextDocumentPositionParams) => {
	return completion.provideCompletionItems(_textDocumentPosition, documents);
});

connection.onHover((params: HoverParams) => {
	return hover.provideHover(params, documents);
});

connection.onExecuteCommand((params: ExecuteCommandParams) =>{
	keyBinding.provideKeyBinding(params, documents, connection);
});

connection.onSignatureHelp((params: SignatureHelpParams) => {
	return signature.provideSignatureHelp(params, documents);
});


connection.onDefinition((params: DefinitionParams) => {
	return definition.provideDefinition(params, documents);
});

documents.onDidOpen(e => {
	const filePath = Files.uriToFilePath(e.document.uri)!;
	if(!TemplatesStatus.lgFilesOfWorkspace.includes(filePath)) {
		TemplatesStatus.lgFilesOfWorkspace.push(filePath);
	}
});

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	diagnostics.updateDiagnostics(change.document, connection);
});



connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	_change.changes.forEach(e => {
		if(e.type == FileChangeType.Created) {
			util.triggerLGFileFinder(workspaceFolders!);
		} else if(e.type == FileChangeType.Deleted) {
			util.triggerLGFileFinder(workspaceFolders!);
			if (TemplatesStatus.templatesMap.has(Files.uriToFilePath(e.uri)!)) {
				TemplatesStatus.templatesMap.delete(Files.uriToFilePath(e.uri)!);
			}
		}
	});
	connection.console.log('We received an file change event');
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
