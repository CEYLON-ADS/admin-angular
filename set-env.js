const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const targetDir = path.join(__dirname, 'src', 'environments');
const targetFile = path.join(targetDir, 'environment.ts');
const targetDevFile = path.join(targetDir, 'environment.development.ts');

// Default environment variables if .env doesn't exist
const defaultEnv = `BASE_URL=http://localhost:8081/
FAST_FOREX_API_URL=https://api.fastforex.io
FAST_FOREX_KEY=cde84bae00-7defdea494-sdz8qg`;

// Create .env file if it doesn't exist
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, defaultEnv, 'utf8');
  console.log('Created default .env file in CeylonAd-Admin.');
}

// Read .env file
const envFile = fs.readFileSync(envPath, 'utf8');

// Parse .env file
const envConfig = {};
envFile.split('\n').forEach(line => {
  const cleanLine = line.trim();
  if (cleanLine && !cleanLine.startsWith('#')) {
    const parts = cleanLine.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      envConfig[key] = value;
    }
  }
});

// Build variables object structure
const baseUrl = envConfig.BASE_URL || 'http://localhost:8081/';
const fastForexApiUrl = envConfig.FAST_FOREX_API_URL || 'https://api.fastforex.io';
const fastForexKey = envConfig.FAST_FOREX_KEY || 'cde84bae00-7defdea494-sdz8qg';

const envFileContent = `// This file is generated dynamically by set-env.js
export const environment = {
  baseUrl: '${baseUrl}',
  fastForexApiUrl: '${fastForexApiUrl}',
  fastForexKey: '${fastForexKey}'
};
`;

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Write to files
fs.writeFileSync(targetFile, envFileContent, 'utf8');
fs.writeFileSync(targetDevFile, envFileContent, 'utf8');

console.log(`Generated Angular environments successfully from .env file:
- ${targetFile}
- ${targetDevFile}`);
