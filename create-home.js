const fs = require('fs');

// Read the JSON files
const lgContent = JSON.parse(fs.readFileSync('./public/template/homelg.json', 'utf8'));
const smContent = JSON.parse(fs.readFileSync('./public/template/homesm.json', 'utf8'));

// Create the object for MongoDB
const homeData = {
  storeId: 'default-store',
  route: 'home',
  lgContent: lgContent,
  smContent: smContent,
  version: '1'
};

console.log('Send this to POST /api/test-mongo:');
console.log(JSON.stringify(homeData, null, 2));