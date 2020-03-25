#! /usr/bin/env node

const {execSync} = require('child_process');
const _ = require('lodash');
const path = require('path');
const loadJsonFile = require('load-json-file');

const {argv} = require('yargs')
  .option('pattern <regex>', {
    type: 'string',
    description: 'Regex that will be matched against the dependency name'
  })
  .demandOption('pattern')
  .option('dry', {
    type: 'boolean',
    description: 'If true, print the yarn commands that will be run, but do not actually run them.'
  });
const pattern = new RegExp(argv.pattern);

const workspaces = JSON.parse(JSON.parse(execSync('yarn workspaces info --json')).data);

_.map(workspaces, ({location}, workspaceName) => {
  const packageJson = loadJsonFile.sync(path.join(location, 'package.json'));

  const updateDependenciesIfNeeded = name => {
    const addModifierFlag = name === 'devDependencies' ? '--dev' : '';
    _(packageJson[name])
      .keys()
      .filter(depName => depName.match(pattern))
      .forEach(depName => {
        // Optimization: Instead of running yarn for each dep, it would be more efficient to batch deps together for 
        // each package.

        const command = `yarn workspace ${workspaceName} add ${addModifierFlag} ${depName}@latest`;
        if (argv.dry) {
          console.log(command);
        } else {
          execSync(command, {
            stdio: 'inherit'
          });
        }
      });
  };

  updateDependenciesIfNeeded('dependencies');
  updateDependenciesIfNeeded('devDependencies');
});
