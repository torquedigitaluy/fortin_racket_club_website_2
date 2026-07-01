const sharp = require("sharp");
const { readdirSync, statSync, writeFileSync, readFileSync } = require("fs");
const { join } = require("path");

const PUBLIC_DIR = join(__dirname, "..", "public");

const SIZES = {
  coach:   { width: 700,  quality: 82 },
  section: { width: 1400, quality: 82 },
  card:    { width: 900,  quality: 82 },
  default: { width: 1920, quality: 80 },
};

function getConfig(filename) {
  const f = filename.toLowerCase();
  if (f.includes("augusto") || f.includes("gime") || f.includes("marti") || f.includes("fede")) return SIZES.coach;
  if (f.includes("reserva de canchas") || f.includes("entrenamientos") || f.includes("escuela") || f.includes("actividades")) return SIZES.card;
  if (f.includes("primer clase") || f.includes("fortin club") || f.includes("plan full") || f.includes("666 b")) return SIZES.section;
  return SIZES.default;
}

const EXTS = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]);

async function main() {
  const files = readdirSync(PUBLIC_DIR).filter((f) => EXTS.has(require("path").extname(f)));
  console.log(`Comprimiendo ${files.length} imágenes...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const filePath = join(PUBLIC_DIR, file);
    const sizeBefore = statSync(filePath).size;
    totalBefore += sizeBefore;

    const { width, quality } = getConfig(file);

    try {
      const input = readFileSync(filePath);
      const buffer = await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality })
        .toBuffer();

      writeFileSync(filePath, buffer);
      totalAfter += buffer.length;

      const pct = (((sizeBefore - buffer.length) / sizeBefore) * 100).toFixed(1);
      console.log(`✓ ${file}`);
      console.log(`  ${(sizeBefore / 1024 / 1024).toFixed(1)} MB → ${(buffer.length / 1024).toFixed(0)} KB  (-${pct}%)\n`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}\n`);
    }
  }

  console.log("─".repeat(50));
  console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
}

main();
