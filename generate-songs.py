#!/usr/bin/env python3
"""Build-time step: refresh public/songs.json from the admin-managed manifest.

The bigdumbidiot-site admin tool owns all song metadata. This copies its
songs.json into stank-radio's public/ folder so that a vite build picks up the
current catalog. Runtime updates between builds are handled by sync-songs.py."""
import os, json, shutil

SOURCE_JSON = "/mnt/user/appdata/bigdumbidiot-site/music/songs.json"
PUBLIC_JSON = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public/songs.json")

def main():
    if not os.path.exists(SOURCE_JSON):
        print(f"Source manifest not found, leaving existing public/songs.json: {SOURCE_JSON}")
        return
    with open(SOURCE_JSON) as fh:
        source = fh.read()
    try:
        count = len(json.loads(source))
    except Exception as e:
        print(f"Source manifest is not valid JSON, skipping: {e}")
        return
    shutil.copyfile(SOURCE_JSON, PUBLIC_JSON)
    print(f"public/songs.json refreshed: {count} tracks")

if __name__ == "__main__":
    main()
