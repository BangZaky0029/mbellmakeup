import os

# --- CONFIG ---
BASE_DIR = r"C:\codingVibes\myPortfolio\mbell\mbell\src\assets"  # root folder assets
FOLDERS = [
    "akad", "akadTanpaSiger", "BeautyShoot", "Bridesmaid", "kelas_makeup",
    "Lamaran", "MakeupTari", "pesta", "photo_grid", "preWedding",
    "siraman", "wisuda"
]

# --- FUNCTION TO DELETE NON-WEBP FILES ---
def delete_non_webp(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if not file.lower().endswith(".webp"):
                try:
                    file_path = os.path.join(root, file)
                    os.remove(file_path)
                    print(f"🗑 Deleted: {file_path}")
                except Exception as e:
                    print(f"❌ Failed to delete {file_path} | Error: {e}")

# --- MAIN PROCESS ---
for folder in FOLDERS:
    folder_path = os.path.join(BASE_DIR, folder)
    if os.path.exists(folder_path):
        delete_non_webp(folder_path)
    else:
        print(f"⚠ Folder not found: {folder_path}")

print("🎉 Done! All non-WebP files have been deleted.")
