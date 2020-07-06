"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsMap = exports.cardTypes = exports.cardPropDictFull = exports.cardPropDict = exports.triggerLGFileFinder = exports.getWordRangeAtPosition = exports.getFunctionEntity = exports.getAllFunctions = exports.getreturnTypeStrFromReturnType = exports.getTemplatesFromCurrentLGFile = exports.isInFencedCodeBlock = exports.isLgFile = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const botbuilder_lg_1 = require("botbuilder-lg");
const templatesStatus_1 = require("./templatesStatus");
const adaptive_expressions_1 = require("adaptive-expressions");
const buildinFunctions_1 = require("./buildinFunctions");
const fs = require("fs");
const path = require("path");
function isLgFile(fileName) {
    if (fileName === undefined || !fileName.toLowerCase().endsWith('.lg')) {
        return false;
    }
    return true;
}
exports.isLgFile = isLgFile;
function isInFencedCodeBlock(doc, position) {
    const textBefore = doc.getText({ start: { line: 0, character: 0 }, end: position });
    const matches = textBefore.match(/```/gm);
    if (matches == null) {
        return false;
    }
    else {
        return matches.length % 2 != 0;
    }
}
exports.isInFencedCodeBlock = isInFencedCodeBlock;
function getTemplatesFromCurrentLGFile(lgFileUri) {
    let result = new botbuilder_lg_1.Templates();
    const engineEntity = templatesStatus_1.TemplatesStatus.templatesMap.get(vscode_languageserver_1.Files.uriToFilePath(lgFileUri));
    if (engineEntity !== undefined && engineEntity.templates.allTemplates.length > 0) {
        result = engineEntity.templates;
    }
    return result;
}
exports.getTemplatesFromCurrentLGFile = getTemplatesFromCurrentLGFile;
function getreturnTypeStrFromReturnType(returnType) {
    let result = '';
    switch (returnType) {
        case adaptive_expressions_1.ReturnType.Boolean:
            result = "boolean";
            break;
        case adaptive_expressions_1.ReturnType.Number:
            result = "number";
            break;
        case adaptive_expressions_1.ReturnType.Object:
            result = "any";
            break;
        case adaptive_expressions_1.ReturnType.String:
            result = "string";
            break;
        case adaptive_expressions_1.ReturnType.Array:
            result = "array";
            break;
    }
    return result;
}
exports.getreturnTypeStrFromReturnType = getreturnTypeStrFromReturnType;
function getAllFunctions(lgFileUri) {
    const functions = new Map();
    for (const func of buildinFunctions_1.buildInfunctionsMap) {
        functions.set(func[0], func[1]);
    }
    const templates = getTemplatesFromCurrentLGFile(lgFileUri);
    for (const template of templates.allTemplates) {
        const functionEntity = new buildinFunctions_1.FunctionEntity(template.parameters, adaptive_expressions_1.ReturnType.Object, `Template reference\r\n ${template.body}`);
        let templateName = template.name;
        if (buildinFunctions_1.buildInfunctionsMap.has(template.name)) {
            templateName = 'lg.' + template.name;
        }
        functions.set(templateName, functionEntity);
    }
    return functions;
}
exports.getAllFunctions = getAllFunctions;
function getFunctionEntity(lgFileUri, name) {
    const allFunctions = getAllFunctions(lgFileUri);
    if (allFunctions.has(name)) {
        return allFunctions.get(name);
    }
    else if (name.startsWith('lg.')) {
        const pureName = name.substr('lg.'.length);
        if (allFunctions.has(pureName)) {
            return allFunctions.get(pureName);
        }
    }
    else {
        const lgWordName = 'lg.' + name;
        if (allFunctions.has(lgWordName)) {
            return allFunctions.get(lgWordName);
        }
    }
    return undefined;
}
exports.getFunctionEntity = getFunctionEntity;
function getWordRangeAtPosition(document, position) {
    const firstPart = /[a-zA-Z0-9_.]+$/.exec(document.getText({ start: document.positionAt(0), end: position }));
    const secondPart = /^[a-zA-Z0-9_.]+/.exec(document.getText({ start: position, end: document.positionAt(document.getText().length - 1) }));
    if (!firstPart && !secondPart) {
        return null;
    }
    const startPosition = firstPart == null ? null : document.positionAt(document.offsetAt(position) - firstPart[0].length);
    const endPosition = secondPart == null ? null : document.positionAt(document.offsetAt(position) + secondPart[0].length);
    const wordRange = {
        start: startPosition == null ? position : startPosition,
        end: endPosition == null ? position : endPosition
    };
    return wordRange;
}
exports.getWordRangeAtPosition = getWordRangeAtPosition;
function triggerLGFileFinder(workspaceFolders) {
    templatesStatus_1.TemplatesStatus.lgFilesOfWorkspace = [];
    workspaceFolders.forEach(workspaceFolder => fs.readdir(vscode_languageserver_1.Files.uriToFilePath(workspaceFolder.uri), (err, files) => {
        if (err) {
            console.log(err);
        }
        else {
            templatesStatus_1.TemplatesStatus.lgFilesOfWorkspace = [];
            files.filter(file => isLgFile(file)).forEach(file => {
                templatesStatus_1.TemplatesStatus.lgFilesOfWorkspace.push(path.join(vscode_languageserver_1.Files.uriToFilePath(workspaceFolder.uri), file));
            });
        }
    }));
}
exports.triggerLGFileFinder = triggerLGFileFinder;
exports.cardPropDict = {
    CardAction: [
        { name: 'title', placeHolder: '{your_title}' },
        { name: 'type', placeHolder: 'imBack' },
        { name: 'value', placeHolder: '{your_value}' }
    ],
    Cards: [
        { name: 'text', placeHolder: '{text}' },
        { name: 'buttons', placeHolder: '{button_list}' }
    ],
    Attachment: [
        { name: 'contenttype', placeHolder: 'herocard' },
        { name: 'content', placeHolder: '{attachment_content}' }
    ],
    Others: [
        { name: 'type', placeHolder: '{typename}' },
        { name: 'value', placeHolder: '{value}' }
    ],
    Activity: [
        { name: 'text', placeHolder: '{text_result}' }
    ]
};
exports.cardPropDictFull = {
    CardAction: [
        { name: 'type', placeHolder: 'imBack' },
        { name: 'title' },
        { name: 'image' },
        { name: 'text' },
        { name: 'displayText' },
        { name: 'channelData' },
        { name: 'image' },
        { name: 'image' },
        { name: 'image' }
    ],
    HeroCard: [
        { name: 'title', placeHolder: '{your_title}' },
        { name: 'subtitle', placeHolder: '{your_subtitle}' },
        { name: 'text', placeHolder: '{text}' },
        { name: 'buttons', placeHolder: '{button_list}' },
        { name: 'images', placeHolder: '{image_list}' },
        { name: 'tap', placeHolder: '{tap}' }
    ],
    ThumbnailCard: [
        { name: 'title', placeHolder: '{your_title}' },
        { name: 'subtitle', placeHolder: '{your_subtitle}' },
        { name: 'text', placeHolder: '{text}' },
        { name: 'buttons', placeHolder: '{button_list}' },
        { name: 'images', placeHolder: '{image_list}' },
        { name: 'tap', placeHolder: '{tap}' }
    ],
    AudioCard: [
        { name: 'title', placeHolder: '{your_title}' },
        { name: 'subtitle', placeHolder: '{your_subtitle}' },
        { name: 'text', placeHolder: '{text}' },
        { name: 'media', placeHolder: '{media_list}' },
        { name: 'buttons', placeHolder: '{button_list}' },
        { name: 'shareable', placeHolder: 'false' },
        { name: 'autoloop', placeHolder: 'false' },
        { name: 'autostart', placeHolder: 'false' },
        { name: 'aspect' },
        { name: 'image' },
        { name: 'duration' },
        { name: 'value' }
    ],
    VideoCard: [
        { name: 'title', placeHolder: '{your_title}' },
        { name: 'subtitle', placeHolder: '{your_subtitle}' },
        { name: 'text', placeHolder: '{text}' },
        { name: 'media', placeHolder: '{media_list}' },
        { name: 'buttons', placeHolder: '{button_list}' },
        { name: 'shareable', placeHolder: 'false' },
        { name: 'autoloop', placeHolder: 'false' },
        { name: 'autostart', placeHolder: 'false' },
        { name: 'aspect' },
        { name: 'image' },
        { name: 'duration' },
        { name: 'value' }
    ],
    AnimationCard: [
        { name: 'title', placeHolder: '{your_title}' },
        { name: 'subtitle', placeHolder: '{your_subtitle}' },
        { name: 'text', placeHolder: '{text}' },
        { name: 'media', placeHolder: '{media_list}' },
        { name: 'buttons', placeHolder: '{button_list}' },
        { name: 'shareable', placeHolder: 'false' },
        { name: 'autoloop', placeHolder: 'false' },
        { name: 'autostart', placeHolder: 'false' },
        { name: 'aspect' },
        { name: 'image' },
        { name: 'duration' },
        { name: 'value' }
    ],
    SigninCard: [
        { name: 'text', placeHolder: '{text}' },
        { name: 'buttons', placeHolder: '{button_list}' }
    ],
    OAuthCard: [
        { name: 'text', placeHolder: '{text}' },
        { name: 'buttons', placeHolder: '{button_list}' },
        { name: 'connectionname' }
    ],
    ReceiptCard: [
        { name: 'title' },
        { name: 'facts' },
        { name: 'items' },
        { name: 'tap' },
        { name: 'total' },
        { name: 'tax' },
        { name: 'vat' },
        { name: 'buttons' }
    ],
    Attachment: [
        { name: 'contenttype', placeHolder: 'herocard' },
        { name: 'content', placeHolder: '{attachment_content}' }
    ],
    Others: [
        { name: 'type', placeHolder: '{typename}' },
        { name: 'value', placeHolder: '{value}' }
    ],
    Activity: [
        { name: 'type' },
        { name: 'textFormat' },
        { name: 'attachmentLayout' },
        { name: 'topicName' },
        { name: 'locale' },
        { name: 'text', placeHolder: '{text_result}' },
        { name: 'speak', placeHolder: '{speak_result}' },
        { name: 'inputHint' },
        { name: 'summary' },
        { name: 'suggestedActions' },
        { name: 'attachments' },
        { name: 'entities' },
        { name: 'channelData' },
        { name: 'action' },
        { name: 'label' },
        { name: 'valueType' },
        { name: 'value' },
        { name: 'name' },
        { name: 'code' },
        { name: 'importance' },
        { name: 'deliveryMode' },
        { name: 'textHighlights' },
        { name: 'semanticAction' },
    ]
};
exports.cardTypes = [
    'HeroCard',
    'SigninCard',
    'ThumbnailCard',
    'AudioCard',
    'VideoCard',
    'AnimationCard',
    'MediaCard',
    'OAuthCard',
    'Attachment',
    'CardAction',
    'AdaptiveCard',
    'Activity',
];
exports.optionsMap = {
    options: {
        '@strict': {
            detail: ' @strict = true',
            documentation: 'Developers who do not want to allow a null evaluated result can implement the strict option.',
            insertText: ' @strict'
        },
        '@replaceNull': {
            detail: ' @replaceNull = ${path} is undefined',
            documentation: 'Developers can create delegates to replace null values in evaluated expressions by using the replaceNull option.',
            insertText: ' @replaceNull'
        },
        '@lineBreakStyle': {
            detail: ' @lineBreakStyle = markdown',
            documentation: 'Developers can set options for how the LG system renders line breaks using the lineBreakStyle option.',
            insertText: ' @lineBreakStyle'
        },
        '@Namespace': {
            detail: ' @Namespace = foo',
            documentation: 'You can register a namespace for the LG templates you want to export.',
            insertText: ' @Namespace'
        },
        '@Exports': {
            detail: ' @Exports = template1, template2',
            documentation: 'You can specify a list of LG templates to export.',
            insertText: ' @Exports'
        }
    },
    strictOptions: {
        'true': {
            detail: ' true',
            documentation: 'Null error will throw a friendly message.',
            insertText: ' true'
        },
        'false': {
            detail: ' false',
            documentation: 'A compatible result will be given.',
            insertText: ' false'
        }
    },
    replaceNullOptions: {
        '${path} is undefined': {
            detail: 'The null input in the path variable would be replaced with ${path} is undefined.',
            documentation: null,
            insertText: ' ${path} is undefined'
        }
    },
    lineBreakStyleOptions: {
        'default': {
            detail: ' default',
            documentation: 'Line breaks in multiline text create normal line breaks.',
            insertText: ' default'
        },
        'markdown': {
            detail: ' markdown',
            documentation: 'Line breaks in multiline text will be automatically converted to two lines to create a newline.',
            insertText: ' markdown'
        }
    }
};
//# sourceMappingURL=util.js.map