const fs = require('fs');
const path = require('path');

const vocabDir = path.join(__dirname, 'vocab-files');
const outputDir = path.join(__dirname, 'frontend', 'data');
const outputFile = path.join(outputDir, 'vocab.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(vocabDir).filter(f => f.endsWith('.html'));

const vocabData = {};

files.forEach(file => {
  const filePath = path.join(vocabDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract unit name from filename, e.g., "Unit 1.html" -> "Unit 1"
  const unitMatch = file.match(/(Unit\s+\d+)/i);
  if (!unitMatch) return;
  const unitKey = unitMatch[1];
  
  // Try to extract the SECTIONS object
  let sections = null;
  const sectionsMatch = content.match(/const\s+SECTIONS\s*=\s*(\{[\s\S]*?\});/);
  if (sectionsMatch) {
    try {
      // It's a JS object, not valid JSON (no quotes on keys), so we eval it safely
      sections = eval('(' + sectionsMatch[1] + ')');
    } catch(e) {
      console.log(`Failed to parse SECTIONS for ${file}`);
    }
  }

  // Try to extract the QUESTIONS array
  let questions = null;
  const questionsMatch = content.match(/const\s+QUESTIONS\s*=\s*(\[[\s\S]*?\]);/);
  if (questionsMatch) {
    try {
      questions = eval('(' + questionsMatch[1] + ')');
    } catch(e) {
      console.log(`Failed to parse QUESTIONS for ${file}`);
    }
  }
  
  if (sections && questions) {
    vocabData[unitKey] = {
      sections,
      questions
    };
    console.log(`Successfully extracted data for ${unitKey}`);
  }
});

fs.writeFileSync(outputFile, JSON.stringify(vocabData, null, 2));
console.log(`Vocabulary data written to ${outputFile}`);
