const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Build the frontend
    console.log('🏗️ Building frontend...');
    execSync('npm run build', { stdio: 'inherit' });

    // Create a simple server file for Vercel
    console.log('🔧 Creating Vercel server file...');
    const serverContent = `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist/public directory
app.use(express.static(path.join(__dirname, 'dist/public')));

// Handle API routes
app.use('/api', (req, res) => {
  res.json({ message: 'API endpoint - use serverless functions for full functionality' });
});

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});

export default app;
`;

    fs.writeFileSync('vercel-server.js', serverContent);

    console.log('✅ Vercel build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
} 