const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/icon-minimalist.svg');
const outputDir = path.join(__dirname, '../assets');

// Pastikan output directory ada
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  try {
    console.log('Generating icons from SVG...');
    
    // Generate PNG (512x512) untuk Linux dan sebagai base
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(outputDir, 'icon.png'));
    console.log('✓ Generated icon.png (512x512)');
    
    // Generate PNG dalam berbagai ukuran untuk ICO
    const sizes = [256, 128, 64, 32, 16];
    const pngFiles = [];
    
    for (const size of sizes) {
      const filename = `icon-${size}.png`;
      const filepath = path.join(outputDir, filename);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(filepath);
      console.log(`✓ Generated ${filename} (${size}x${size})`);
      pngFiles.push(filepath);
    }
    
    // Convert PNG files ke ICO
    console.log('\nConverting PNG to ICO...');
    const pngBuffers = pngFiles.map(file => fs.readFileSync(file));
    const icoBuffer = await toIco(pngBuffers);
    fs.writeFileSync(path.join(outputDir, 'icon.ico'), icoBuffer);
    console.log('✓ Generated icon.ico');
    
    // Hapus file PNG intermediate (tidak diperlukan setelah ICO dibuat)
    for (const filepath of pngFiles) {
      fs.unlinkSync(filepath);
    }
    console.log('✓ Cleaned up intermediate PNG files');
    
    console.log('\n✅ All icons generated successfully!');
    
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

