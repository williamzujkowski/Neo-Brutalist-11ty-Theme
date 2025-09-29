#!/usr/bin/env python3
"""
Create apple-touch-icon.png from base64 encoded PNG data
"""

import base64

def create_apple_icon():
    """Create a simple apple-touch-icon.png with Neo-Brutalist design."""

    # Base64 encoded PNG (180x180) with Neo-Brutalist "B" design on yellow background
    # This is a pre-generated simple PNG with the design
    png_base64 = """
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
a4mMcgAAAABJRU5ErkJggg==
    """

    # Decode and write the PNG file
    png_data = base64.b64decode(png_base64)

    with open('src/assets/images/apple-touch-icon.png', 'wb') as f:
        f.write(png_data)

    print("✅ Created apple-touch-icon.png")

if __name__ == '__main__':
    create_apple_icon()