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
    paddingTop: /فاصله\s?بالایی\s?رو\s?برامی\s?(\d+)\s?پیکسل\s?کن/,
    paddingBottom: /فاصله\s?پایینی\s?رو\s?برامی\s?(\d+)\s?پیکسل\s?کن/,
    marginTop: /حاشیه\s?بالایی\s?رو\s?برامی\s?(\d+)\s?پیکسل\s?کن/,
    marginBottom: /حاشیه\s?پایینی\s?رو\s?برامی\s?(\d+)\s?پیکسل\s?کن/,
    gridColumns: /تعداد\s?ستون\s?ها\s?رو\s?برام\s?(\d+)\s?کن/,
    backgroundColor: /رنگ\s?پس\s?زمینه\s?رو\s?(.*)\s?کن/,
  };

  for (const [key, regex] of Object.entries(regexMap)) {
    const match = input.match(regex);
    if (match) updates[key] = isNaN(Number(match[1])) ? match[1] : parseInt(match[1], 10);
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
