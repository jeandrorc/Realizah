module.exports = {
  // TypeScript/JavaScript files
  '**/*.{ts,tsx,js,jsx}': [
    'prettier --write',
    'eslint --fix',
  ],
  
  // JSON files
  '**/*.json': [
    'prettier --write',
  ],
  
  // Markdown files
  '**/*.md': [
    'prettier --write',
  ],
  
  // CSS/SCSS files
  '**/*.{css,scss}': [
    'prettier --write',
  ],
};
