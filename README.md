# Upgrade Yarn Workspaces Deps
Super simple tool to upgrade deps across all your yarn workspaces. May be largely made obsolete by Yarn 2.

Problem: You have a project with many workspaces, and many dependencies, and you want to upgrade a subset of them.

Solution:

```
$ upgrade-yarn-workspaces-deps --pattern <regex that will match the package name you want to upgrade>
```

For instance, to upgrade all Jest-related packages:

```
$ upgrade-yarn-workspace-deps --pattern '^jest' --dry
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

Run `--help` for more detail:

```
Options:
  --help                     Show help                                 [boolean]
  --version                  Show version number                       [boolean]
  --pattern                  Regex that will be matched against the dependency
                             name                            [string] [required]
  --dry                      If true, print the yarn commands that will be run,
                             but do not actually run them.             [boolean]
  --remove                   Remove packages instead of adding them.   [boolean]
  --print-matching-packages  Print all package names that will be updated, and
                             exit without actually updating.           [boolean]
  --install-version          The version to install.                    [string]

```
