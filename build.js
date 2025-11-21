const fs = require('fs');

// Get the CORS proxy URL from environment variable
const corsProxyUrl = process.env.CORS_PROXY_URL || '';

// Read the template HTML file
const template = fs.readFileSync('index.template.html', 'utf8');

let obfuscatedCode;

if (corsProxyUrl) {
    // Simple obfuscation: Base64 encode and split into chunks
    const encoded = Buffer.from(corsProxyUrl).toString('base64');
    const chunks = [];
    for (let i = 0; i < encoded.length; i += 8) {
        chunks.push(encoded.substring(i, i + 8));
    }

    // Generate obfuscated proxy URL code
    obfuscatedCode = `
        // Reconstructed proxy URL (obfuscated)
        const _p = ['${chunks.join("','")}'].join('');
        const proxyUrl = atob(_p);
`;
    console.log('Building with CORS proxy enabled');
} else {
    // No proxy URL provided, build without it
    obfuscatedCode = `
        // No CORS proxy configured
        const proxyUrl = '';
`;
    console.log('Building without CORS proxy (direct requests only)');
}

// Replace placeholder with obfuscated code
const finalHtml = template.replace('{{CORS_PROXY_INJECTION}}', obfuscatedCode);

// Write the final HTML file
fs.writeFileSync('index.html', finalHtml);

console.log('Build completed successfully');