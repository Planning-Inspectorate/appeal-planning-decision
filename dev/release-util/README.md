# Release Util

Utilities to aid the release process.

## Commit Summary

Run `npm run commit-summary <tag>` to produce a CSV containing: commit, ticket, ticket title, ticket status.

This can be useful for finding the latest point in git history where all tickets are ready for release.

Setup an `.env` file, using `.env.example` as a template. You'll need a JIRA API key.

## Update released issues

Run `npm run update-released-issues -- --release-link=<link> --release-name=<name> <ticket-ids>...` to transition the tickets to released, with a comment containing the released link and name.

Setup an `.env` file, using `.env.example` as a template. You'll need a JIRA API key.

e.g. 

`npm run update-released-issues -- --release-link=https://pins-ds.atlassian.net/wiki/spaces/AAPDS/pages/1366851585/2024-01-11+Appeals+Release --release-name="2024-01-11 Appeals Release" aapd-954`