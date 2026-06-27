#!/usr/bin/env python3

from pathlib import Path
from PIL import Image
import json
import shutil

APP_ROOT = Path(__file__).resolve().parents[1]
IMAGES = APP_ROOT / "public" / "images"

DIRS = {
    "candidates": IMAGES / "candidates",
    "promoted": IMAGES / "promoted",
    "rejected": IMAGES / "rejected",
    "production": IMAGES / "production",
}

ASSETS = {
    "header": {
        "size": (1920, 150),
        "output": "industrial-header-v2.png",
        "padding": 4,
    },
    "footer": {
        "size": (1920, 130),
        "output": "industrial-warning-footer-v2.png",
        "padding": 4,
    },
    "player": {
        "size": (1198, 856),
        "output": "industrial-player-shell-v3.png",
        "padding": 0,
    },
    "library": {
        "size": (680, 856),
        "output": "industrial-library-frame-v2.png",
        "padding": 0,
    },
}

MANIFEST = DIRS["production"] / "manifest.json"


def ensure_dirs():
    for base in ["candidates", "promoted", "rejected"]:
        for asset in list(ASSETS) + ["misc"]:
            (DIRS[base] / asset).mkdir(parents=True, exist_ok=True)
    DIRS["production"].mkdir(parents=True, exist_ok=True)


def choose_asset():
    keys = list(ASSETS)
    print("\nSelect asset:")
    for i, key in enumerate(keys, 1):
        w, h = ASSETS[key]["size"]
        print(f"{i}) {key}  {w}x{h}")

    choice = input("> ").strip()
    return keys[int(choice) - 1]


def choose_file(folder: Path):
    files = sorted([p for p in folder.iterdir() if p.suffix.lower() == ".png"])
    if not files:
        raise SystemExit(f"No PNG files found in {folder}")

    print(f"\nSelect file from {folder}:")
    for i, p in enumerate(files, 1):
        print(f"{i}) {p.name}")

    choice = input("> ").strip()
    return files[int(choice) - 1]


def move_candidate(target_dir_name):
    asset = choose_asset()
    src = choose_file(DIRS["candidates"] / asset)
    dst = DIRS[target_dir_name] / asset / src.name

    confirm = input(f"\nMove {src.name} to {target_dir_name}/{asset}? y/N: ").strip().lower()
    if confirm != "y":
        print("Cancelled.")
        return

    shutil.move(str(src), str(dst))
    print(f"Moved: {dst}")


def alpha_bounds(img):
    return img.getchannel("A").getbbox()


def export_asset():
    asset = choose_asset()
    profile = ASSETS[asset]

    src = choose_file(DIRS["promoted"] / asset)
    dst = DIRS["production"] / profile["output"]

    w, h = profile["size"]
    print(f"\nExporting {src.name}")
    print(f"Output: {dst.name}")
    print(f"Target: {w}x{h}")

    confirm = input("Proceed? y/N: ").strip().lower()
    if confirm != "y":
        print("Cancelled.")
        return

    img = Image.open(src).convert("RGBA")
    bounds = alpha_bounds(img)

    if not bounds:
        raise SystemExit("No visible pixels found. Alpha channel appears empty.")

    trimmed = img.crop(bounds)
    padding = profile["padding"]

    padded = Image.new(
        "RGBA",
        (trimmed.width + padding * 2, trimmed.height + padding * 2),
        (0, 0, 0, 0),
    )
    padded.alpha_composite(trimmed, (padding, padding))

    exported = padded.resize(profile["size"], Image.Resampling.LANCZOS)
    exported.save(dst)

    verify = Image.open(dst).convert("RGBA")
    if verify.size != profile["size"]:
        raise SystemExit(f"FAILED: expected {profile['size']}, got {verify.size}")

    manifest = {}
    if MANIFEST.exists():
        manifest = json.loads(MANIFEST.read_text())

    manifest[asset] = {
        "candidate": src.name,
        "production_file": dst.name,
        "size": f"{w}x{h}",
    }

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")

    print("\nSTANK EXPORT COMPLETE")
    print(f"Production: {dst}")
    print(f"Manifest:   {MANIFEST}")


def validate():
    print("\nProduction validation:")
    for asset, profile in ASSETS.items():
        path = DIRS["production"] / profile["output"]
        if not path.exists():
            print(f"❌ {asset}: missing {profile['output']}")
            continue

        img = Image.open(path).convert("RGBA")
        ok_size = img.size == profile["size"]
        has_alpha = img.mode == "RGBA"

        print(f"{'✅' if ok_size and has_alpha else '❌'} {asset}: {path.name} {img.size[0]}x{img.size[1]} RGBA={has_alpha}")


def main():
    ensure_dirs()

    while True:
        print("""
STANK Asset Manager

1) Promote candidate
2) Reject candidate
3) Export production asset
4) Validate production assets
5) Quit
""")
        choice = input("> ").strip()

        if choice == "1":
            move_candidate("promoted")
        elif choice == "2":
            move_candidate("rejected")
        elif choice == "3":
            export_asset()
        elif choice == "4":
            validate()
        elif choice == "5":
            break
        else:
            print("Invalid choice.")


if __name__ == "__main__":
    main()
