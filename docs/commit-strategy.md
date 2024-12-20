# Commit/Branching Strategy

## Branching

Please follow the established [branching strategy](https://pins-ds.atlassian.net/wiki/spaces/AAPDS/pages/425132090/Branching+strategy).
In the event of divergence from the README, the external document will take
precedence.

All commit messages must be written in the [Conventional Commit Format](#commit-message-format).

## Commit Message Rules

You must ensure that you are using the correct commit type.
These should be used appropriately - for instance, if you are refactoring the
repo structure without changing any of the application, this would be appropriate to
use `chore`. If you are fixing a bug then `fix` should be used. A new feature should
use the type `feat`.

## Ensure Linear Commits

It's very important that PRs have linear commits. There can be multiple commits per PR
(if appropriate), but they should be linear. An example of a non-linear commit is:

```shell
7fa9388 (feature/my-wonderful-feature): feat(some-brilliant-feat): this is a brilliant feature I've worked hard on
bf2a09e erm, not sure why CI has broken so another go
067c88e gah, I'm stupid. I can see why CI broke
```

This is not linear because you're fixing something inside the PR. This should be [rebased](https://github.com/Planning-Inspectorate/appeal-planning-decision/wiki/An-intro-to-Git-Rebase)
so it's linear:

```shell
6fd721a (feature/my-wonderful-feature): feat(some-brilliant-feat): this is a brilliant feature I've worked hard on
```

Linear commits are much easier to find problems when tracing through Git history.

## Commitizen

To automatically generate the format correctly, please use Commitizen to make
all commits to this repo. This repo is
[Commitizen-friendly](https://github.com/commitizen/cz-cli).

There is linting on commit messages in the repo, both in GitHub Actions and
as a commit hook.

Either:

    npm install -g commitizen

And then:

    git add .
    git cz

Or:

    git add .
    npm run commit
