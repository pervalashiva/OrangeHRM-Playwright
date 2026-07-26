#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
# shellcheck disable=SC1090
source ~/.nvm/nvm.sh
export PLAYWRIGHT_HOST_PLATFORM_OVERRIDE="${PLAYWRIGHT_HOST_PLATFORM_OVERRIDE:-mac15-arm64}"
# Fresh browser profile — avoids Chrome Translate / leftover language from prior runs
npx playwright test tests/login.spec.ts --headed --workers=1 --reporter=list "$@"
