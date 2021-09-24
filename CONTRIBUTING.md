# Contributing to Rubick

## Set up

Install dev deps after git clone the repo.

```bash
$ npm install
$ npm run rebuild
$ npm run dev
```

## Build

Transform with babel and webpack.

```bash
# macos
$ npm run build

# other system
$ npm run build_win
```

## Docs

```bash
# add doc
$ cd docs
$ npm i
$ npm run docs:dev
```

## Pull requests
**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

All pull requests are welcome. Thanks for taking the time to contribute.

- Create an issue about the features, such as new components.
- Fork the repo to your own account.
- Clone your fork.
- Create a new branch base on `dev`, if you want to add new component, the branch name should be formatted as `component-[Component Name]`. (e.g. `component-steps`) And the commit info should be formatted as `[Component Name]: Info about commit`.
- Make sure that running `npm run build_win` outputs the correct files.
- Rebase before creating a PR to keep commit history clear. (Merge request to branch `dev`)
- Provide some description about your PR.
