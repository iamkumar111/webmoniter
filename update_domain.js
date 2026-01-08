
const fs = require('fs');
const path = require('path');

const targetStr = 'websmonitor';
const replaceStr = 'websmonitor';

const rootDir = process.cwd();

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.next' && file !== 'dist') {
                walkDir(filePath);
            }
        } else {
            // Check if it's a file we want to process (text files)
             const ext = path.extname(file).toLowerCase();
             if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.prisma', '.html', '.txt'].includes(ext)) {
                processFile(filePath);
             }
        }
    });
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(targetStr)) {
            const newContent = content.replaceAll(targetStr, replaceStr);
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

console.log('Starting replacement...');
walkDir(rootDir);
console.log('Replacement complete.');
