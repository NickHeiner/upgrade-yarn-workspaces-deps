# Update Yarn Workspaces Deps
Super simple tool to update deps across all your yarn workspaces.

Problem: You have a project with many workspaces, and many dependencies, and you want to update a subset of them.

Solution:

```
$ update-yarn-workspaces-deps/index.js --pattern <regex that will match the package name you want to update>
```

For instance, to update all Babel-related packages:

```
$ update-yarn-workspaces-deps/index.js --pattern @babel
```

Pass `--dry` to see what `yarn workspace` commands this tool will run, without running them.