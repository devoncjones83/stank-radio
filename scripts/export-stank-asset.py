#!/usr/bin/env python3

from pathlib import Path
from PIL import Image

APP_ROOT = Path(__file__).resolve().parents[1]

CANDIDATE_DIR = APP_ROOT / "public" / "images" / "candidates"
OUTPUT_DIR = APP_ROOT / "public" / "images"

TARGETS = {
    "footer": {
        "input": "FC-3.png",
        "output": "industrial-warning-footer-v2.png",
        "size": (1920, 130),
        "padding": 4,
    },
}


def alpha_bounds(img: Image.Image):
    if img.mode != "RGBA":
        img = img.convert("RGBA")

    alpha = img.getchannel("A")
    return alpha.getbbox()


def export_asset(input_path: Path, output_path: Path, size: tuple[int, int], padding: int):
    if not input_path.exists():
        raise FileNotFoundError(f"Missing candidate: {input_path}")

    img = Image.open(input_path).convert("RGBA")

    bounds = alpha_bounds(img)
    if not bounds:
        raise ValueError(f"No visible pixels found in {input_path}")

    trimmed = img.crop(bounds)

    padded = Image.new(
        "RGBA",
        (trimmed.width + padding * 2, trimmed.height + padding * 2),
        (0, 0, 0, 0),
    )
    padded.alpha_composite(trimmed, (padding, padding))

    exported = padded.resize(size, Image.Resampling.LANCZOS)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    exported.save(output_path)

    verify = Image.open(output_path)
    if verify.size != size:
        raise RuntimeError(f"Export failed: expected {size}, got {verify.size}")

    print(f"STANK EXPORT COMPLETE")
    print(f"Input:  {input_path}")
    print(f"Output: {output_path}")
    print(f"Size:   {verify.size[0]}x{verify.size[1]}")


def main():
    for name, config in TARGETS.items():
        print(f"\nExporting {name}...")

        export_asset(
            input_path=CANDIDATE_DIR / config["input"],
            output_path=OUTPUT_DIR / config["output"],
            size=config["size"],
            padding=config["padding"],
        )


if __name__ == "__main__":
    main()

