#!/usr/bin/env bash
# Push this repo to the live StackCP server over FTPS.
#
# Uploads exactly the files git tracks (git ls-files — already respects
# .gitignore, and already includes the generated templates/docx and
# templates/xlsx files on purpose). Never deletes anything remote, even if
# a file has been removed locally — clean those up by hand if it happens.
#
# Setup: cp deploy.env.example deploy.env, then fill in FTP_PASS.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

ENV_FILE="deploy.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE. Copy deploy.env.example to $ENV_FILE and fill in FTP_PASS first." >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

for var in FTP_HOST FTP_USER FTP_PASS REMOTE_PATH; do
  if [[ -z "${!var:-}" ]]; then
    echo "$var is not set in $ENV_FILE." >&2
    exit 1
  fi
done

AUTO_YES=0
if [[ "${1:-}" == "-y" || "${1:-}" == "--yes" ]]; then
  AUTO_YES=1
fi

# StackCP's FTPS endpoint sends only its own leaf certificate, not the Let's
# Encrypt intermediate that chains it to a trusted root — so curl can't
# verify it against the system trust store alone, even though that store is
# perfectly fine. Fix it properly (don't disable verification): build a
# combined CA file from whichever system bundle exists plus the shipped
# intermediate (deploy-ca/stackcp-intermediate.pem), and pass that in via
# --cacert. Falls back to curl's own default if no known bundle is found.
CACERT_ARGS=()
for SYSTEM_BUNDLE in /etc/ssl/certs/ca-certificates.crt /etc/pki/tls/certs/ca-bundle.crt /etc/ssl/cert.pem; do
  if [[ -f "$SYSTEM_BUNDLE" ]]; then
    COMBINED_CA="$(mktemp)"
    trap 'rm -f "$COMBINED_CA"' EXIT
    cat "$SYSTEM_BUNDLE" deploy-ca/stackcp-intermediate.pem > "$COMBINED_CA"
    CACERT_ARGS=(--cacert "$COMBINED_CA")
    break
  fi
done
if [[ ${#CACERT_ARGS[@]} -eq 0 ]]; then
  echo "Warning: no known system CA bundle found — falling back to curl's default trust store. If uploads fail with an SSL certificate error, that's why." >&2
fi

mapfile -t FILES < <(git ls-files)
TOTAL=${#FILES[@]}

echo "Deploying $TOTAL files to ftp://$FTP_HOST$REMOTE_PATH (FTPS, upload-only, never deletes)."
if [[ "$AUTO_YES" -ne 1 ]]; then
  read -r -p "Continue? [y/N] " REPLY
  if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

FAILED=()
DONE=0
for file in "${FILES[@]}"; do
  DONE=$((DONE + 1))
  printf '[%d/%d] %s\n' "$DONE" "$TOTAL" "$file"
  if ! curl --fail --silent --show-error --ssl-reqd --ftp-create-dirs \
       "${CACERT_ARGS[@]}" \
       -u "$FTP_USER:$FTP_PASS" \
       -T "$file" \
       "ftp://$FTP_HOST$REMOTE_PATH/$file"; then
    echo "  FAILED: $file" >&2
    FAILED+=("$file")
  fi
done

echo
if [[ ${#FAILED[@]} -eq 0 ]]; then
  echo "Done. $TOTAL/$TOTAL files uploaded."
else
  echo "Done with errors: $((TOTAL - ${#FAILED[@]}))/$TOTAL uploaded, ${#FAILED[@]} failed:" >&2
  printf '  %s\n' "${FAILED[@]}" >&2
  exit 1
fi
