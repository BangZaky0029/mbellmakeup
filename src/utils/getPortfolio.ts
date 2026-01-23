// src/utils/getPortfolio.ts
import type { PortfolioItem } from "../types";

// Import semua gambar di src/assets
const images = import.meta.glob("../assets/**/*.{jpg,jpeg,png,webp}", { eager: true, import: "default" });

// Fungsi untuk menyamakan folder name dengan nama kategori
function formatCategory(folderName: string) {
  return folderName
    .replace(/([A-Z])/g, " $1")    // tambah spasi sebelum huruf kapital
    .replace(/_/g, " ")             // ganti underscore dengan spasi
    .replace(/\b\w/g, c => c.toUpperCase()) // huruf pertama tiap kata jadi kapital
    .trim();
}

export function generatePortfolio(): PortfolioItem[] {
  const items: PortfolioItem[] = [];

  Object.entries(images).forEach(([path, src]) => {
    const parts = path.split("/"); 
    const folder = parts[parts.length - 2]; // nama folder
    const filename = parts[parts.length - 1];

    items.push({
      id: `${folder}-${filename}`,
      title: filename.replace(/\.(jpg|jpeg|png|webp)$/i, ""), 
      category: formatCategory(folder), // <-- pakai formatCategory
      imageUrl: src as string,
      description: `Portfolio image from ${formatCategory(folder)}`,
    });
  });

  return items;
}
