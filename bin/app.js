#!/usr/bin/env node
const hbs = require('handlebars');
const fs = require('fs');
const program = require('commander');
const yaml = require('js-yaml');
const pkjson = require('../package.json');
const path = require('path');


const parseYaml = (filePath) => {
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`File '${filePath}' not found.`);            
    }

    if (filePath.toLowerCase().indexOf('.yml') !== -1 || filePath.toLowerCase().indexOf('.yaml') !== -1) {
        return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
    } else {
        return JSON.parse(fs.readFileSync(filePath, 'utf8').toString())
    }
}

program
    .version(pkjson.version)
    .command("parse")
    .requiredOption('-t,--template <source>', "Handlebars template to be parsed")
    .requiredOption('-d,--data <data>', "JSON or YAML file")
    .action(function (options) {
        const dataFilePath = path.resolve(options.data);
        const textfileContent = fs.readFileSync(options.template).toString();
        const data = parseYaml(dataFilePath)

        const template = hbs.compile(textfileContent);
        const result = template(data);
        console.log(result)
    });

try {
    program.parse(process.argv);
} catch (err) {
    console.log("Error:", err.message);
}