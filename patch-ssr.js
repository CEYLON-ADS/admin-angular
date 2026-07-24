const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules', '@angular', 'ssr', 'fesm2022', 'ssr.mjs');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const unpatchedTarget = '...this.manifest.allowedHosts';
  const patchedReplacement = '...(this.manifest.allowedHosts ?? [])';
  
  if (content.includes(unpatchedTarget)) {
    content = content.replaceAll(unpatchedTarget, patchedReplacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched ssr.mjs successfully to handle non-iterable allowedHosts!');
  } else {
    console.log('ssr.mjs is already patched or does not contain the unpatched target.');
  }
} else {
  console.log('ssr.mjs not found at ' + filePath);
}
