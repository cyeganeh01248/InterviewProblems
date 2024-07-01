#!/usr/bin/env bash
pushd dist
bun run --watch server.js
popd
