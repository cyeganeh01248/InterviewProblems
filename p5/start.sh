#!/usr/bin/env bash
pushd frontend
bun run build-frontend-bundle
popd
pushd backend
bun run build-server-bundle
popd
pushd dist
./server
popd
