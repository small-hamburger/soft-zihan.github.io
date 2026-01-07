import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const outputFile = path.join(publicDir, 'files.json'); 
const notesDir = path.join(rootDir, 'notes');

// We now treat 'notes' as the single source of truth.
// Users should put all categories inside 'notes/'.
console.log("🌸 Scanning content root:", notesDir);

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Helper to recursively scan directory
function scanDirectory(dirPath, relativePath) {
  if (!fs.existsSync(dirPath)) return [];
  
  const items = fs.readdirSync(dirPath);
  const result = [];

  for (const item of items) {
    if (item.startsWith('.')) continue; // skip hidden files

    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    // Ensure forward slashes for web compatibility
    // relativePath is empty for root items, so we just use item
    const itemRelativePath = relativePath ? path.join(relativePath, item).replace(/\\/g, '/') : item;

    if (stat.isDirectory()) {
      const children = scanDirectory(fullPath, itemRelativePath);
      // Only add directories if they have content
      if (children.length > 0) {
        result.push({
          name: item,
          path: itemRelativePath,
          type: 'directory',
          children: children
        });
      }
    } else if (item.endsWith('.md')) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'file',
        lastModified: stat.mtime.toISOString()
      });
    }
  }
  return result;
}

try {
  // Directly scan the notes folder and use its children as the root of our tree
  const fileTree = scanDirectory(notesDir, '');
  
  fs.writeFileSync(outputFile, JSON.stringify(fileTree, null, 2));
  console.log(`✅ Successfully generated public/files.json (${fileTree.length} root items)`);
} catch (error) {
  console.error('❌ Error generating tree:', error);
  // Do not fail hard, just log, so CI can proceed if needed, but usually we want to know.
  process.exit(1);
}