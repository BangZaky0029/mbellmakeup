import os
from PIL import Image

# ==========================
# KONFIGURASI
# ==========================
SOURCE_DIR = r"C:\codingVibes\vite\mbell\public\assets"
TARGET_DIR = r"C:\codingVibes\myPortfolio\mbell"

MAX_WIDTH = 1920        # batas lebar maksimum (px)
JPEG_QUALITY = 75       # kualitas JPG (0-100)
PNG_OPTIMIZE = True

SUPPORTED_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")

# ==========================
# FUNGSI OPTIMASI GAMBAR
# ==========================
def optimize_image(src_path, dst_path):
    with Image.open(src_path) as img:
        img = img.convert("RGB") if img.mode in ("RGBA", "P") else img

        # Resize proporsional
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_size = (MAX_WIDTH, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        os.makedirs(os.path.dirname(dst_path), exist_ok=True)

        ext = os.path.splitext(dst_path)[1].lower()

        if ext in (".jpg", ".jpeg"):
            img.save(dst_path, "JPEG", quality=JPEG_QUALITY, optimize=True)
        elif ext == ".png":
            img.save(dst_path, "PNG", optimize=PNG_OPTIMIZE)
        elif ext == ".webp":
            img.save(dst_path, "WEBP", quality=JPEG_QUALITY)
        else:
            img.save(dst_path)

# ==========================
# PROSES SEMUA FILE
# ==========================
def process_all_images():
    for root, dirs, files in os.walk(SOURCE_DIR):
        for file in files:
            src_file = os.path.join(root, file)
            relative_path = os.path.relpath(src_file, SOURCE_DIR)
            dst_file = os.path.join(TARGET_DIR, relative_path)

            if file.lower().endswith(SUPPORTED_EXTENSIONS):
                try:
                    optimize_image(src_file, dst_file)
                    print(f"✔ Optimized: {relative_path}")
                except Exception as e:
                    print(f"✖ Failed: {relative_path} -> {e}")
            else:
                # Copy file non-image apa adanya
                os.makedirs(os.path.dirname(dst_file), exist_ok=True)
                with open(src_file, "rb") as fsrc, open(dst_file, "wb") as fdst:
                    fdst.write(fsrc.read())

if __name__ == "__main__":
    process_all_images()
    print("\n✅ Semua file berhasil diproses & dipindahkan!")
