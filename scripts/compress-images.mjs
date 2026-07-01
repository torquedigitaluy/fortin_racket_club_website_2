/**
 * Comprime todas las imágenes grandes de /public en su lugar.
 * Uso: node scripts/compress-images.mjs
 */
import sharp from "sharp";
import { readdirSync, statSync, writeFileSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

// Dimensiones máximas por tipo de imagen
const SIZES = {
  coach: { width: 700, quality: 82 },      // fotos de entrenadores (portrait)
  section: { width: 1400, quality: 82 },   // imágenes de secciones (media pantalla)
  card: { width: 900, quality: 82 },       // cards de servicios
  default: { width: 1920, quality: 80 },   // hero / full-width
};

function getConfig(filename) {
  const f = filename.toLowerCase();
  if (f.includes("augusto") || f.includes("gime") || f.includes("marti") || f.includes("fede")) {
    return SIZES.coach;
  }
  if (f.includes("reserva de canchas") || f.includes("entrenamientos") || f.includes("escuela") || f.includes("actividades")) {
    return SIZES.card;
  }
  if (f.includes("primer clase") || f.includes("fortin club") || f.includes("plan full") || f.includes("666 b")) {
    return SIZES.section;
  }
  return SIZES.default;
}

const EXTS = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]);

const files = readdirSync(PUBLIC_DIR).filter((f) => EXTS.has(extname(f)));

console.log(`Comprimiendo ${files.length} imágenes en ${PUBLIC_DIR}\n`);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = join(PUBLIC_DIR, file);
  const tmpPath = filePath + ".tmp";
  const sizeBefore = statSync(filePath).size;
  totalBefore += sizeBefore;

  const { width, quality } = getConfig(file);

  try {
    const buffer = await sharp(filePath)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    writeFileSync(filePath, buffer);

    const sizeAfter = buffer.length;
    totalAfter += sizeAfter;

    const pct = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1);
    console.log(`✓ ${file}`);
    console.log(`  ${(sizeBefore / 1024 / 1024).toFixed(1)} MB → ${(sizeAfter / 1024).toFixed(0)} KB  (-${pct}%)\n`);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log("─".repeat(50));
console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
