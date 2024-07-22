# Contributing Guide

This project is FOSS under the MIT License. Contributions including feature addition and bug fixes are highly welcomed. This basic contributing guide will walk you through the project structure and good git practices.

## Project structure

```
.
├── src - react frontend
│   ├── assets - common assets (mock)
│   ├── components - all react components
│   │   └── common - shared react components
│   ├── constants - shared constants
│   ├── lib - isolated logic with ui
│   ├── middleware - compatibility layer
│   ├── redux - redux store/slices
│   └── types - common types
├── src-electron - electron backend
│   ├── dist - compiled .js
│   └── target - compiled release targets (linux)
└── src-tauri - tauri backend
    ├── src - rust src
    └── target - compiled release targets (win32)
```

## Version tags

```
x.y.z
^ ^ ^
^ ^ Minor version (basic bug fixes)
^ Middle version (bug fixes, config edits)
Major version (big feature changes)
```

## Git branch / commit messages

The following are currently accepted git prefixes:

- `ui`: ui style tuning.
- `fix`: bug fix.
- `ref`: code refractor.
- `doc`: document change.
- `feat`: feature addition / augmentation.
- `conf`: configuration change.

A git branch should use one of the prefix and be informative about the purpose. An exmaple of a good git branch is: `feat/add-app-menu`. A bad example is: `feat/some-experiments`.

A commit message should also use one of the prefix. A good example is: `ui: changes app menu color`. Keep concise but informative.
