# Update Yarn Workspaces Deps
Super simple tool to update deps across all your yarn workspaces.

Problem: You have a project with many workspaces, and many dependencies, and you want to update a subset of them.

Solution:

```
$ update-yarn-workspaces-deps/index.js --pattern <regex that will match the package name you want to update>
```

For instance, to update all Jest-related packages:

```
$ update-yarn-workspace-deps --pattern '^jest' --dry
yarn workspace nf-foo-framework add --dev jest-matcher-deep-close-to@latest
yarn workspace odp add  jest-diff@latest
yarn workspace eslint-plugin-foo add --dev jest-util@latest
yarn workspace nf-foo-bar add --dev jest@latest
yarn workspace foo-jest-matchers add  jest-snapshot@latest
yarn workspace foo add  jest@latest
yarn workspace foo add  jest-circus@latest
yarn workspace foo add  jest-each-table@latest
yarn workspace foo add  jest-extended@latest
yarn workspace foo add  jest-html-reporters@latest
yarn workspace foo add  jest-mock-now@latest
yarn workspace foo add  jest-runner-eslint@latest
yarn workspace foo add  jest-watch-select-projects@latest
yarn workspace foo add  jest-watch-typeahead@latest
yarn workspace @foo/sample add  jest-matcher-utils@latest
```

Pass `--dry` to see what `yarn workspace` commands this tool will run, without running them.