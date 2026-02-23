"""
Portfolio Website Image Optimizer
=================================
Compresses oversized images (like the 20 MB "its me.png") to web-friendly
sizes while maintaining visual quality. Outputs optimized WebP and JPEG
versions and optionally updates HTML references.

Usage:
    python optimize_images.py                 # Optimize all images in project
    python optimize_images.py --file "its me.png"  # Optimize a specific file
    python optimize_images.py --max-dim 1920  # Set max dimension (default: 1920)
    python optimize_images.py --quality 85    # Set JPEG/WebP quality (default: 80)
    python optimize_images.py --update-html   # Also update HTML references

Requirements:
    pip install Pillow
"""

import os
import sys
import glob
import shutil
import argparse
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow is not installed. Run: pip install Pillow")
    sys.exit(1)


# ─── Configuration ────────────────────────────────────────────────────────────

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif"}
SIZE_THRESHOLD_BYTES = 500 * 1024  # Only optimize files > 500 KB
BACKUP_DIR = "backups/original_images"

# ─── Core Functions ───────────────────────────────────────────────────────────


def format_size(size_bytes: int) -> str:
    """Human-readable file size."""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"


def optimize_image(
    input_path: str,
    max_dim: int = 1920,
    quality: int = 80,
    output_format: str = "webp",
) -> dict:
    """
    Optimize a single image file.

    Args:
        input_path: Path to the source image.
        max_dim: Maximum width or height in pixels.
        quality: JPEG/WebP quality (1-100).
        output_format: 'webp', 'jpeg', or 'both'.

    Returns:
        dict with results (original size, new size, output paths).
    """
    input_path = Path(input_path)
    if not input_path.exists():
        return {"error": f"File not found: {input_path}"}

    original_size = input_path.stat().st_size
    results = {
        "input": str(input_path),
        "original_size": original_size,
        "original_size_human": format_size(original_size),
        "outputs": [],
    }

    # Open and process
    img = Image.open(input_path)
    original_dimensions = img.size
    results["original_dimensions"] = f"{original_dimensions[0]}x{original_dimensions[1]}"

    # Convert RGBA/P to RGB for JPEG compatibility
    if img.mode in ("RGBA", "P", "LA"):
        # Preserve transparency for WebP, flatten for JPEG
        img_rgb = img.convert("RGB")
    else:
        img_rgb = img

    # Downscale if larger than max_dim
    img_rgb.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    if img.mode in ("RGBA", "P", "LA"):
        img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

    new_dimensions = img_rgb.size
    results["new_dimensions"] = f"{new_dimensions[0]}x{new_dimensions[1]}"

    stem = input_path.stem

    # ── Save WebP (best compression, modern browsers) ──
    if output_format in ("webp", "both"):
        webp_path = input_path.parent / f"{stem}.webp"
        # Use RGBA-capable image for WebP if available
        save_img = img if img.mode == "RGBA" else img_rgb
        save_img.save(webp_path, format="WEBP", quality=quality, method=6)
        webp_size = webp_path.stat().st_size
        results["outputs"].append(
            {
                "path": str(webp_path),
                "format": "WebP",
                "size": webp_size,
                "size_human": format_size(webp_size),
                "reduction": f"{(1 - webp_size / original_size) * 100:.1f}%",
            }
        )

    # ── Save JPEG (universal fallback) ──
    if output_format in ("jpeg", "both"):
        jpeg_path = input_path.parent / f"{stem}.jpg"
        img_rgb.save(jpeg_path, format="JPEG", quality=quality, optimize=True)
        jpeg_size = jpeg_path.stat().st_size
        results["outputs"].append(
            {
                "path": str(jpeg_path),
                "format": "JPEG",
                "size": jpeg_size,
                "size_human": format_size(jpeg_size),
                "reduction": f"{(1 - jpeg_size / original_size) * 100:.1f}%",
            }
        )

    return results


def backup_original(file_path: str, project_dir: str) -> str:
    """Move original file to backup directory."""
    backup_dir = Path(project_dir) / BACKUP_DIR
    backup_dir.mkdir(parents=True, exist_ok=True)
    dest = backup_dir / Path(file_path).name
    shutil.copy2(file_path, dest)
    return str(dest)


def update_html_references(
    project_dir: str, old_name: str, new_name: str
) -> list:
    """Find and replace image references in HTML files."""
    updated_files = []
    for html_file in glob.glob(os.path.join(project_dir, "**/*.html"), recursive=True):
        with open(html_file, "r", encoding="utf-8") as f:
            content = f.read()
        if old_name in content:
            new_content = content.replace(old_name, new_name)
            with open(html_file, "w", encoding="utf-8") as f:
                f.write(new_content)
            updated_files.append(html_file)
    return updated_files


def find_images(project_dir: str) -> list:
    """Find all image files in the project directory."""
    images = []
    for ext in SUPPORTED_EXTENSIONS:
        images.extend(glob.glob(os.path.join(project_dir, f"*{ext}")))
        images.extend(glob.glob(os.path.join(project_dir, f"**/*{ext}"), recursive=True))
    # Deduplicate
    return list(set(images))


# ─── Main ─────────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(
        description="Optimize images for the Portfolio Website"
    )
    parser.add_argument(
        "--file", type=str, help="Specific file to optimize (default: all images)"
    )
    parser.add_argument(
        "--max-dim",
        type=int,
        default=1920,
        help="Maximum width/height in pixels (default: 1920)",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=80,
        help="JPEG/WebP quality 1-100 (default: 80)",
    )
    parser.add_argument(
        "--format",
        choices=["webp", "jpeg", "both"],
        default="both",
        help="Output format (default: both)",
    )
    parser.add_argument(
        "--update-html",
        action="store_true",
        help="Update HTML files to reference optimized images",
    )
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="Skip backing up originals",
    )

    args = parser.parse_args()

    project_dir = os.path.dirname(os.path.abspath(__file__))

    print("=" * 60)
    print("  Portfolio Website Image Optimizer")
    print("=" * 60)
    print(f"  Project:    {project_dir}")
    print(f"  Max dim:    {args.max_dim}px")
    print(f"  Quality:    {args.quality}")
    print(f"  Format:     {args.format}")
    print(f"  Update HTML: {args.update_html}")
    print("=" * 60)

    # Collect images to process
    if args.file:
        file_path = os.path.join(project_dir, args.file)
        if not os.path.exists(file_path):
            print(f"\nError: File not found: {file_path}")
            sys.exit(1)
        images = [file_path]
    else:
        images = find_images(project_dir)
        # Exclude backup directory
        images = [
            img
            for img in images
            if BACKUP_DIR not in img and ".git" not in img
        ]

    if not images:
        print("\nNo images found to optimize.")
        return

    print(f"\nFound {len(images)} image(s) to process:\n")

    total_saved = 0

    for img_path in images:
        file_size = os.path.getsize(img_path)
        file_name = os.path.basename(img_path)

        print(f"  [IMG] {file_name} ({format_size(file_size)})")

        if file_size < SIZE_THRESHOLD_BYTES:
            print(f"     >> Skipped (under {format_size(SIZE_THRESHOLD_BYTES)} threshold)\n")
            continue

        # Backup original
        if not args.no_backup:
            backup_path = backup_original(img_path, project_dir)
            print(f"     [BACKUP] Saved to: {os.path.relpath(backup_path, project_dir)}")

        # Optimize
        result = optimize_image(
            img_path,
            max_dim=args.max_dim,
            quality=args.quality,
            output_format=args.format,
        )

        if "error" in result:
            print(f"     [ERROR] {result['error']}\n")
            continue

        print(f"     [RESIZE] {result['original_dimensions']} -> {result['new_dimensions']}")

        for output in result["outputs"]:
            saved = result["original_size"] - output["size"]
            total_saved += saved
            print(
                f"     [OK] {output['format']}: {output['size_human']} "
                f"(reduced {output['reduction']})"
            )
            output_name = os.path.basename(output["path"])
            print(f"        -> {output_name}")

        # Update HTML references if requested
        if args.update_html and result["outputs"]:
            # Prefer WebP, fallback to JPEG
            preferred = next(
                (o for o in result["outputs"] if o["format"] == "WebP"),
                result["outputs"][0],
            )
            new_name = os.path.basename(preferred["path"])
            updated = update_html_references(project_dir, file_name, new_name)
            if updated:
                for f in updated:
                    print(f"     [HTML] Updated: {os.path.relpath(f, project_dir)}")

        print()

    print("=" * 60)
    print(f"  Total space saved: {format_size(total_saved)}")
    print("=" * 60)


if __name__ == "__main__":
    main()
