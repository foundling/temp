const chalk = require('chalk');
const path = require('path');
const util = require('util');
const striptags = require('striptags');
const { keys, flatten, decodeHTML, splitBy } = require(path.join(__dirname, './utils'));
const { columnize } = require(path.join(__dirname, './columns'));

function progInfo(packageInfo) {

    const info = {
        ' node version ': process.version,
        ' node-help version ': packageInfo.version,
        ' github ': chalk.green(packageInfo.repository.url)
    };

    return Object.keys(info).map(k => {
        const prop = k;
        const value = info[k];
        return `${chalk.bgWhite.black(prop)} ${chalk.black(value)}`;
    }).join('\n');

}

function summary(docsCount) {
    return `\n${chalk.red(`[ ${docsCount} Result(s) for Node.js. ]`)}`;
}

function getMethods(o) {
    return keys(o)
        .filter(k => o[k] && o.hasOwnProperty(k) && typeof o[k] === 'function');
}

function getOwnProperties(o) {
    return Object.getOwnPropertyNames(o)
                        .filter(name => typeof o[name] !== 'function');
}


function formatES(node, query) {

    return [
        `${chalk.red('[ Additional Information ]')}\n`,
        `${chalk.green.underline('toString:')} '${node.toString()}'`,
        `${chalk.green.underline('valueOf:')} '${node.valueOf()}'`,
        `${chalk.green.underline('Constructor:')} ${ node.constructor.name }`,
        `${chalk.green.underline('Own Properties (non-methods):')} ${ columnize(getOwnProperties(node)) }`,
        `${chalk.green.underline('Methods:')} ${ columnize(getMethods(node)) }\n`,
    ].join('\n'); 
}

function formatSignatures(signatures=[]) {
    const signatureArray = flatten(signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);
    return signatureArray.length ? '\n' + signatureArray.join('\n') : '';
}

function formatDescription(desc) {
    return desc.trim().length ? '\n' + striptags(decodeHTML(desc)).trim() : '';
}

function formatNodeJS(node, searchToken) {

    const {name, textRaw, type, desc, signatures} = node;
    const sections = [
        `${chalk.bgWhite.black(` ${node.type} | ${searchToken} `)}`,
        `${chalk.green.underline('Name:')} ${name}`,
        `${chalk.green.underline('Node.js Object Type:')} ${type}`,
        `${chalk.green.underline('Signature(s):')} ${textRaw} ${formatSignatures(signatures)}`,
        `${chalk.green.underline('Description:')} ${formatDescription(desc)}`,
    ];

    return sections.join('\n');

}

module.exports = exports = {
    progInfo,
    formatNodeJS,
    formatES,
    summary,
};
