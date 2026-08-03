#!/usr/bin/env python3
"""Deploy the admin-managed songs.json into the served stank-radio folders.

The bigdumbidiot-site admin tool is the single source of truth for all song
metadata (titles, tags, descriptions, playlists, covers). It writes
SOURCE_JSON. stank-radio reads the same fields, and the /music/songs and
/music/covers paths it uses are already correct, so this script just copies
the file into the locations nginx serves -- only when it actually changed, so
it is safe to run frequently from cron. No vite build or container restart
needed; nginx serves songs.json as a static file on the next request."""
import os, json, shutil

SOURCE_JSON = "/mnt/user/appdata/bigdumbidiot-site/music/songs.json"

APP_ROOT = "/mnt/user/appdata/bigdumbidiot-stank-radio"
SERVED_TARGETS = [
    os.path.join(APP_ROOT, "public/songs.json"),
    os.path.join(APP_ROOT, "dist/songs.json"),
    os.path.join(APP_ROOT, "dist/stank-radio/songs.json"),
]

def main():
    if not os.path.exists(SOURCE_JSON):
        print(f"Source manifest not found: {SOURCE_JSON}")
        return

    with open(SOURCE_JSON) as fh:
        source = fh.read()

    # Validate it is parseable before deploying, and count tracks.
    try:
        count = len(json.loads(source))
    except Exception as e:
        print(f"Source manifest is not valid JSON, skipping: {e}")
        return

    changed = False
    for target in SERVED_TARGETS:
        if not os.path.isdir(os.path.dirname(target)):
            continue
        old = ""
        if os.path.exists(target):
            with open(target) as fh:
                old = fh.read()
        if old != source:
            with open(target, "w") as fh:
                fh.write(source)
            changed = True

    if changed:
        print(f"songs.json deployed: {count} tracks")

if __name__ == "__main__":
    main()
