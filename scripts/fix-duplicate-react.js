#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fonction pour corriger les duplications d'import React
function fixDuplicateReact(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let hasReactImport = false;
  let hasReactTypeImport = false;
  let reactImportIndex = -1;
  let reactTypeImportIndex = -1;
  
  // Analyser les lignes pour trouver les imports React
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('import React from') || line.startsWith("import React from")) {
      hasReactImport = true;
      reactImportIndex = i;
    }
    
    if (line.startsWith('import type React') || line.startsWith('import type * as React')) {
      hasReactTypeImport = true;
      reactTypeImportIndex = i;
    }
  }
  
  // Si on a les deux types d'import, supprimer l'import de type
  if (hasReactImport && hasReactTypeImport) {
    console.log(`🔧 Suppression de l'import type React dans: ${filePath}`);
    lines.splice(reactTypeImportIndex, 1);
    fs.writeFileSync(filePath, lines.join('\n'));
    return true;
  }
  
  return false;
}

// Fonction principale
function main() {
  const pattern = 'src/**/*.tsx';
  const files = glob.sync(pattern, { ignore: ['**/node_modules/**'] });
  
  let fixedCount = 0;
  
  files.forEach(file => {
    try {
      if (fixDuplicateReact(file)) {
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Erreur avec ${file}:`, error.message);
    }
  });
  
  console.log(`\n🎉 Terminé! ${fixedCount} fichiers corrigés.`);
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { fixDuplicateReact }; 