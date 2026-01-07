const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const notesDir = path.join(rootDir, 'notes');
// Write files.json to the root so it can be fetched as ./files.json in both Dev and Prod (GitHub Pages)
const outputFile = path.join(rootDir, 'files.json'); 

console.log("🌸 Scanning notes directory:", notesDir);

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
    const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/');

    if (stat.isDirectory()) {
      const children = scanDirectory(fullPath, itemRelativePath);
      // Only add directories if they are not empty (optional, but cleaner)
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'directory',
        children: children
      });
    } else if (item.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'file',
        lastModified: stat.mtime.toISOString(),
        content: content
      });
    }
  }
  return result;
}

// Generate structure
try {
  if (!fs.existsSync(notesDir)) {
    console.log('No "notes" folder found. Creating empty one.');
    fs.mkdirSync(notesDir);
  }

  // We start the tree directly from the content of 'notes', but wrap it in a root if needed.
  // The App expects an array of nodes.
  const fileTree = [{
    name: 'notes',
    path: 'notes',
    type: 'directory',
    children: scanDirectory(notesDir, 'notes')
  }];

  fs.writeFileSync(outputFile, JSON.stringify(fileTree, null, 2));
  console.log('✅ Successfully generated files.json');
} catch (error) {
  console.error('❌ Error generating tree:', error);
  process.exit(1);
}