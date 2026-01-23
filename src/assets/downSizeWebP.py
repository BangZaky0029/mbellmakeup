from PIL import Image
import os

# --- CONFIG ---
BASE_DIR = r"C:\codingVibes\myPortfolio\mbell\mbell\src\assets"  # root folder assets
FOLDERS = [
    "akad", "akadTanpaSiger", "BeautyShoot", "Bridesmaid", "kelas_makeup",
    "Lamaran", "MakeupTari", "pesta", "photo_grid", "preWedding",
    "siraman", "wisuda"
]
MAX_SIZE = 1280      # max width/height
QUALITY = 70         # WebP quality

# --- FUNCTION TO PROCESS IMAGES ---
def convert_folder_to_webp(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith((".jpg", ".jpeg", ".png")):
                try:
                    file_path = os.path.join(root, file)
                    img = Image.open(file_path).convert("RGB")
                    img.thumbnail((MAX_SIZE, MAX_SIZE))  # maintain aspect ratio
                    webp_file = os.path.splitext(file_path)[0] + ".webp"
                    img.save(webp_file, "WEBP", quality=QUALITY)
                    print(f"✅ Converted: {file_path} → {webp_file}")
                except Exception as e:
                    print(f"❌ Failed: {file_path} | Error: {e}")

# --- MAIN PROCESS ---
for folder in FOLDERS:
    folder_path = os.path.join(BASE_DIR, folder)
    if os.path.exists(folder_path):
        convert_folder_to_webp(folder_path)
    else:
        print(f"⚠ Folder not found: {folder_path}")

print("🎉 All done! WebP conversion completed.")
