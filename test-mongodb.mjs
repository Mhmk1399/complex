import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import connect from './lib/data.tsx';
import Jsons from './models/jsons.ts';

async function testMongoDB() {
  try {
    await connect();
    console.log('✅ Connected to MongoDB');

    // Read JSON files
    const lgContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/template/homelg.json'), 'utf8'));
    const smContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/template/homesm.json'), 'utf8'));

    // Test data
    const testData = {
      storeId: 'test-store-123',
      route: 'home',
      lgContent: lgContent,
      smContent: smContent,
      version: '1'
    };

    // Save to MongoDB
    const result = await Jsons.findOneAndUpdate(
      { storeId: testData.storeId, route: testData.route },
      testData,
      { upsert: true, new: true }
    );

    console.log('✅ Data saved to MongoDB');
    console.log('Document ID:', result._id);
    console.log('Store ID:', result.storeId);
    console.log('Route:', result.route);
    console.log('LG Content sections count:', result.lgContent.sections.children.sections.length);
    console.log('SM Content sections count:', result.smContent.sections.children.sections.length);

    // Test retrieval
    const retrieved = await Jsons.findOne({ storeId: testData.storeId, route: testData.route });
    console.log('✅ Data retrieved successfully');
    console.log('Retrieved route:', retrieved.route);

    await mongoose.disconnect();
    console.log('✅ Test completed successfully');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testMongoDB();