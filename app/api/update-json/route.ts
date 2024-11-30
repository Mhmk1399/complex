import { NextResponse } from 'next/server';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import fs from 'fs';
import path from 'path';

// Load JSON
function loadJson(filePath: string) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Failed to load JSON file:`, error);
    throw new Error('JSON file load failed.');
  }
}

// Save JSON
function saveJson(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Regex parsing
function parseInputWithRegex(input: string) {
  const updates: { [key: string]: string | number } = {};
  
  const regexMap = {
    // Existing patterns with variations
    paddingTop: /(?:فاصله|پدینگ)\s?(?:از\s)?بالا(?:یی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    
    paddingBottom: /(?:فاصله|پدینگ)\s?(?:از\s)?پایین(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    
    marginTop: /(?:حاشیه|مارجین)\s?(?:از\s)?بالا(?:یی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    
    marginBottom: /(?:حاشیه|مارجین)\s?(?:از\s)?پایین(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    
    // New patterns for additional properties
    width: /(?:عرض|پهنا)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    
    height: /(?:ارتفاع|طول)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    
    fontSize: /(?:سایز|اندازه)\s?(?:فونت|متن)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    
    borderRadius: /(?:گردی|شعاع)\s?(?:گوشه‌ها|لبه‌ها)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    
    opacity: /(?:شفافیت|تاری)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:درصد)?\s?(?:بذار|کن|تنظیم کن)/i,
    
    // Color-related patterns
    backgroundColor: /(?:رنگ|کالر)\s?(?:پس زمینه|بک گراند|زمینه)(?:ی)?\s?(?:را|رو)\s?(.*?)\s?(?:بذار|کن|تنظیم کن)/i,
    
    color: /(?:رنگ|کالر)\s?(?:متن|فونت)(?:ی)?\s?(?:را|رو)\s?(.*?)\s?(?:بذار|کن|تنظیم کن)/i,
    
    // Layout patterns
    display: /(?:نمایش|دیسپلی)(?:ی)?\s?(?:را|رو)\s?(.*?)\s?(?:بذار|کن|تنظیم کن)/i,
    
    position: /(?:موقعیت|پوزیشن)(?:ی)?\s?(?:را|رو)\s?(.*?)\s?(?:بذار|کن|تنظیم کن)/i,
    
    gridColumns: /(?:تعداد|شمار)\s?(?:ستون|کالم)(?:ها)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:بذار|کن|تنظیم کن)/i
  };

  for (const [key, regex] of Object.entries(regexMap)) {
    const match = input.match(regex);
    if (match) {
      const value = match[1].trim();
      updates[key] = isNaN(Number(value)) ? value : parseInt(value, 10);
    }
  }

  return updates;
}

// TensorFlow.js processing
async function processInputWithTensorFlow(input: string) {
  try {
    console.log('Loading Universal Sentence Encoder...');
    const embedder = await use.load();
    console.log('Loading TensorFlow.js model...');
    const model = await tf.loadGraphModel('/model_tfjs/model.json');

    console.log('Embedding input...');
    const embeddings = await embedder.embed([input]);

    console.log('Making predictions...');
    const predictions = model.predict(embeddings as unknown as tf.Tensor) as tf.Tensor;
    const predictionsArray = await predictions.array() as number[][];
    const labels = ['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom', 'gridColumns', 'backgroundColor'];
    const maxIndex = predictionsArray[0].indexOf(Math.max(...predictionsArray[0]));
    return labels[maxIndex];
  } catch (error) {
    console.error('Error in TensorFlow.js processing:', error);
    throw error;
  }
}
// POST handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputText } = body;

    const filePath = path.join(process.cwd(), 'public', 'template', 'product.json');

    console.log('Loading JSON from:', filePath);
    const jsonData = loadJson(filePath);

    let updates = {};
    try {
      // Try TensorFlow.js processing
      const predictedKey = await processInputWithTensorFlow(inputText);
      updates = { [predictedKey]: parseInputWithRegex(inputText)[predictedKey] || 0 };
    } catch (error) {
      // If TensorFlow.js fails, fallback to regex
      console.error('TensorFlow.js failed, falling back to regex:', error);
      updates = parseInputWithRegex(inputText);
    }

    // Update JSON settings
    console.log('Applying updates:', updates);
    Object.assign(jsonData.children.sections[0].setting, updates);

    // Save updated JSON
    saveJson(filePath, jsonData);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
