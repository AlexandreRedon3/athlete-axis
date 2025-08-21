#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fonction pour ajouter l'import React si nécessaire
function addReactImport(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Vérifier si React est déjà importé
  if (content.includes('import React') || content.includes('import * as React')) {
    return false; // React est déjà importé
  }
  
  // Vérifier si c'est un fichier TSX avec des composants React
  if (!content.includes('export') || !content.includes('return')) {
    return false; // Pas un composant React
  }
  
  // Trouver la ligne après "use client" ou le début du fichier
  const lines = content.split('\n');
  let insertIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '"use client"' || line === "'use client'") {
      insertIndex = i + 1;
      break;
    }
    if (line.startsWith('import ') || line.startsWith('//') || line.startsWith('/*')) {
      insertIndex = i + 1;
    } else if (line.length > 0) {
      break;
    }
  }
  
  // Insérer l'import React APRÈS la directive "use client"
  lines.splice(insertIndex, 0, 'import React from \'react\';');
  
  // Écrire le fichier modifié
  fs.writeFileSync(filePath, lines.join('\n'));
  return true;
}

// Fonction pour corriger l'ordre des imports
function fixImportOrder(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Vérifier si le fichier a "use client" et React import
  const hasUseClient = lines.some(line => line.trim() === '"use client"' || line.trim() === "'use client'");
  const hasReactImport = lines.some(line => line.includes('import React'));
  
  if (hasUseClient && hasReactImport) {
    // Trouver les indices
    let useClientIndex = -1;
    let reactImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '"use client"' || line === "'use client'") {
        useClientIndex = i;
      }
      if (line.includes('import React')) {
        reactImportIndex = i;
      }
    }
    
    // Si React est importé avant "use client", corriger l'ordre
    if (reactImportIndex < useClientIndex) {
      // Supprimer l'import React
      lines.splice(reactImportIndex, 1);
      
      // Réinsérer après "use client"
      lines.splice(useClientIndex + 1, 0, 'import React from \'react\';');
      
      // Écrire le fichier corrigé
      fs.writeFileSync(filePath, lines.join('\n'));
      return true;
    }
  }
  
  return false;
}

// Fonction principale
function main() {
  const pattern = 'src/**/*.tsx';
  const files = glob.sync(pattern, { ignore: ['**/node_modules/**'] });
  
  let modifiedCount = 0;
  let fixedCount = 0;
  
  files.forEach(file => {
    try {
      // D'abord corriger l'ordre des imports
      if (fixImportOrder(file)) {
        console.log(`🔧 Corrigé l'ordre des imports dans: ${file}`);
        fixedCount++;
      }
      
      // Puis ajouter React si nécessaire
      if (addReactImport(file)) {
        console.log(`✅ Ajouté import React à: ${file}`);
        modifiedCount++;
      }
    } catch (error) {
      console.error(`❌ Erreur avec ${file}:`, error.message);
    }
  });
  
  console.log(`\n🎉 Terminé! ${modifiedCount} fichiers modifiés, ${fixedCount} fichiers corrigés.`);
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { addReactImport, fixImportOrder }; 