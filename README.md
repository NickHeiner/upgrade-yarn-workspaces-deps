# Upgrade Yarn Workspaces Deps
Super simple tool to upgrade deps across all your yarn workspaces. May be largely made obsolete by Yarn 2.

Problem: You have a project with many workspaces, and many dependencies, and you want to upgrade a subset of them. For instance, maybe you require many different `jest` packages, and you'd like to upgrade or remove them all.

Solution #1: Edit them all by hand. If your project is small enough, this works fine.

Solution #2: Use `yarn upgrade-interactive`. This works unless:
  * You have so many outdated dependencies that the interactive list is painful to search through, even with yarn's `--scope` flag.
  * You want to remove instead of upgrade packages.
  * You want to specify an exact version to upgrade to, and you can't specify that version through yarn's `--latest`, `--caret`, or `--tilde` flags.

Solution #3: Use this tool.

```
$ upgrade-yarn-workspace-deps --pattern <regex that will match the package name you want to upgrade>
```

For instance, imagine you had a workspace with packages `nf-foo-framework`, `odp`, `foo`, `nf-foo-bar`, `foo-jest-matchers`, `eslint-plugin-foo`, and `@foo/sample`. You'd like to upgrade all Jest-related packages. You can run:

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
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  --pattern          Regex that will be matched against the dependency name.
                     Tip: for an exact match, pass '^package-name$'. To match
                     packages that match only part of the pattern, use
                     negative-lookaheads. For instance, to match all 'babel'
                     packages but not 'babel-jest', pass 'babel(?!-jest)'.
                                                             [string] [required]
  --dry              If true, print the yarn commands that will be run, but do
                     not actually run them.                            [boolean]
  --remove           Remove packages instead of adding them.           [boolean]
  --print-metadata   Print all dependencies and dependents that will be touched.
                     Requires --dry to also be passed.                 [boolean]
  --install-version  The version to install.                            [string]

```
