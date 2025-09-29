#!/usr/bin/env python3
"""
Create favicon.ico from SVG for Neo-Brutalist theme
"""

import os
import subprocess

def create_favicon():
    """Create favicon.ico from SVG using ImageMagick or direct base64 if not available."""

    # Check if ImageMagick is available
    try:
        subprocess.run(['convert', '--version'], capture_output=True, check=True)
        has_imagemagick = True
    except (subprocess.CalledProcessError, FileNotFoundError):
        has_imagemagick = False

    if has_imagemagick:
        # Use ImageMagick to convert SVG to ICO
        svg_path = 'src/assets/images/favicon.svg'
        ico_path = 'src/assets/images/favicon.ico'

        # Create multiple sizes and combine into ICO
        sizes = ['16x16', '32x32', '48x48']
        png_files = []

        for size in sizes:
            png_file = f'src/assets/images/favicon-{size}.png'
            cmd = ['convert', '-background', 'none', '-resize', size, svg_path, png_file]
            subprocess.run(cmd, check=True)
            png_files.append(png_file)

        # Combine PNGs into ICO
        cmd = ['convert'] + png_files + [ico_path]
        subprocess.run(cmd, check=True)

        # Clean up temporary PNGs
        for png_file in png_files:
            os.remove(png_file)

        print(f"✅ Created {ico_path}")
    else:
        print("⚠️  ImageMagick not found. Creating a basic ICO file...")
        # Create a basic ICO file manually
        create_basic_ico()

def create_basic_ico():
    """Create a basic ICO file without external dependencies."""
    import struct

    # ICO header structure
    # Reserved (2 bytes) + Type (2 bytes) + Count (2 bytes)
    ico_header = struct.pack('<HHH', 0, 1, 1)  # 0, 1=ICO, 1 image

    # Directory entry (16 bytes per image)
    # Width, Height, Colors, Reserved, Planes, BitCount, Size, Offset
    width = 32
    height = 32

    # Create a simple bitmap representation
    # This is a simplified version - a proper implementation would need full BMP data
    bmp_data = create_simple_bmp(width, height)

    dir_entry = struct.pack('<BBBBHHII',
                           width if width < 256 else 0,  # Width
                           height if height < 256 else 0, # Height
                           0,  # Color palette
                           0,  # Reserved
                           1,  # Color planes
                           32, # Bits per pixel
                           len(bmp_data), # Size of image data
                           6 + 16)  # Offset to image data

    # Write ICO file
    ico_path = 'src/assets/images/favicon.ico'
    with open(ico_path, 'wb') as f:
        f.write(ico_header)
        f.write(dir_entry)
        f.write(bmp_data)

    print(f"✅ Created basic {ico_path}")

def create_simple_bmp(width, height):
    """Create a simple BMP data for the favicon."""
    # BMP header (40 bytes)
    bmp_header = struct.pack('<IIIHHIIIIII',
                           40,  # Header size
                           width,  # Width
                           height * 2,  # Height (doubled for AND mask)
                           1,  # Planes
                           32,  # Bits per pixel
                           0,  # Compression
                           width * height * 4,  # Image size
                           0,  # X pixels per meter
                           0,  # Y pixels per meter
                           0,  # Colors used
                           0)  # Important colors

    # Create pixel data (BGRA format)
    # Yellow background with black border effect
    pixels = []
    for y in range(height):
        for x in range(width):
            # Create border effect
            if x < 2 or x >= width - 2 or y < 2 or y >= height - 2:
                # Black border
                pixels.extend([0, 0, 0, 255])  # BGRA: Black
            elif x < 4 or x >= width - 4 or y < 4 or y >= height - 4:
                # Inner border
                pixels.extend([0, 0, 0, 255])  # BGRA: Black
            else:
                # Yellow background
                pixels.extend([0, 238, 255, 255])  # BGRA: #FFEE00

    # AND mask (transparency mask) - all opaque
    and_mask = bytes([0] * (width * height // 8))

    return bmp_header + bytes(pixels) + and_mask

if __name__ == '__main__':
    create_favicon()