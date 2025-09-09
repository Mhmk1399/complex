const fs = require('fs');

// Read the JSON files
const lgContent = JSON.parse(fs.readFileSync('./public/template/homelg.json', 'utf8'));
const smContent = JSON.parse(fs.readFileSync('./public/template/homesm.json', 'utf8'));

// Create the object that will be saved to MongoDB
const mongoObject = {
  storeId: 'storemfcdfog4456qhn',
  route: 'home',
  lgContent: lgContent,
  smContent: smContent,
  version: '1'
};

console.log('MongoDB Object Structure:');
console.log('========================');
console.log('storeId:', mongoObject.storeId);
console.log('route:', mongoObject.route);
console.log('version:', mongoObject.version);
console.log('lgContent type:', typeof mongoObject.lgContent);
console.log('smContent type:', typeof mongoObject.smContent);
console.log('lgContent sections count:', mongoObject.lgContent.sections.children.sections.length);
console.log('smContent sections count:', mongoObject.smContent.sections.children.sections.length);

// Show first few properties of lgContent
console.log('\nLG Content structure:');
console.log('- type:', mongoObject.lgContent.type);
console.log('- has sections:', !!mongoObject.lgContent.sections);
console.log('- has children:', !!mongoObject.lgContent.sections.children);

console.log('\nSM Content structure:');
console.log('- type:', mongoObject.smContent.type);
console.log('- has sections:', !!mongoObject.smContent.sections);
console.log('- has children:', !!mongoObject.smContent.sections.children);

// POST to MongoDB
const postToMongoDB = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/test-mongo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mongoObject)
    });

    const result = await response.json();
    console.log('\n✅ POST Response:', result);
  } catch (error) {
    console.error('❌ POST Error:', error);
  }
};

postToMongoDB();