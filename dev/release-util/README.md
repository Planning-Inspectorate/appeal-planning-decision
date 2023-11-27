# Release Util

Utilities to aid the release process.

## Commit Summary

Run `npm run commit-summary <tag>` to produce a CSV containing: commit, ticket, ticket title, ticket status.

This can be useful for finding the latest point in git history where all tickets are ready for release.

Setup an `.env` file, using `.env.example` as a template. You'll need a JIRA API key.