import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import fs from 'fs';
import path from 'path';
import Fuse from 'fuse.js';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Load JSON Dataset
function loadJson(filePath: string) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Failed to load JSON file:', error);
    throw new Error('JSON file load failed.');
  }
}

// Save JSON
function saveJson(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Deep Update for JSON Structure
function deepUpdate(obj: any, updates: any) {
  for (const key in updates) {
    const keys = key.split('.'); // Support nested keys
    let current = obj;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        current[k] = updates[key];
      } else {
        if (!current[k]) current[k] = {};
        current = current[k];
      }
    });
  }
}

// Fuzzy Matching for Enhanced Understanding
const dataset = loadJson(path.join(process.cwd(), 'data', 'nlp_dataset.json')); // Assuming your dataset file
const fuse = new Fuse(dataset, { keys: ['input'], threshold: 0.3 });

function fuzzyMatch(input: string): any {
  const result = fuse.search(input);
  console.log('Fuzzy match result:', result);
  if (result.length) {
    return (result[0].item as { output: any }).output;
  }
  return null;
}function parseInputWithRegex(input: string) {
  const updates: { [key: string]: string | number } = {};

  const regexMap = {
    paddingTop: /(?:فاصله|پدینگ)\s?(?:از\s)?بالا(?:یی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    paddingBottom: /(?:فاصله|پدینگ)\s?(?:از\s)?پایین(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    marginTop: /(?:حاشیه|مارجین)\s?(?:از\s)?بالا(?:یی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    marginBottom: /(?:حاشیه|مارجین)\s?(?:از\s)?پایین(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    width: /(?:عرض|پهنا)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    height: /(?:ارتفاع|طول)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    fontSize: /(?:سایز|اندازه)\s?(?:فونت|متن)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    borderRadius: /(?:گردی|شعاع)\s?(?:گوشه‌ها|لبه‌ها)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:پیکسل)?\s?(?:بذار|کن|تنظیم کن)/i,
    opacity: /(?:شفافیت|تاری)(?:ی)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:درصد)?\s?(?:بذار|کن|تنظیم کن)/i,
    backgroundColor: /(?:رنگ|کالر)\s?(?:پس زمینه|بک گراند|زمینه)(?:ی)?\s?(?:را|رو)\s?(.*?)\s?(?:بذار|کن|تنظیم کن)/i,
    color: /(?:رنگ|کالر)\s?(?:متن|فونت)(?:ی)?\s?(?:را|رو)\s?(.*?)\s?(?:بذار|کن|تنظیم کن)/i,
    display: /(?:نمایش|دیسپلی)(?:ی)?\s?(?:را|رو)\s?(.*?)\s?(?:بذار|کن|تنظیم کن)/i,
    position: /(?:موقعیت|پوزیشن)(?:ی)?\s?(?:را|رو)\s?(.*?)\s?(?:بذار|کن|تنظیم کن)/i,
    gridColumns: /(?:تعداد|شمار)\s?(?:ستون|کالم)(?:ها)?\s?(?:را|رو)\s?(?:به|برامی)?\s?(\d+)\s?(?:بذار|کن|تنظیم کن)/i,
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

function ensureMask(input: string): string {
  const targetWords = ['رنگ', 'کالر', 'بک گراند', 'پس زمینه'];
  for (const word of targetWords) {
    const regex = new RegExp(`\\b(${word})\\b`, 'i');
    if (regex.test(input)) {
      return input.replace(regex, '[MASK]');
    }
  }
  return `${input} [MASK]`; // Fallback to appending a mask
}


async function parseWithParsBERT(input: string) {
  try {
    const maskedInput = ensureMask(input);
    const response = await hf.fillMask({
      model: 'HooshvareLab/bert-base-parsbert-uncased',
      inputs: maskedInput,
    });

    console.log('ParsBERT predictions:', response); // Log full response
    const topPrediction = response[0]?.token_str.trim();
    return topPrediction ? { backgroundColor: topPrediction } : null;
  } catch (error) {
    console.error('ParsBERT parsing failed:', error instanceof Error ? error.message : String(error));
    return null;
  }
}


// Main API Handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputText } = body as { inputText: string };

    const filePath = path.join(process.cwd(), 'public', 'template', 'product.json');
    const jsonData = loadJson(filePath);

    let updates = null;

    // Step 1: Fuzzy Match against Dataset
    updates = fuzzyMatch(inputText);

    // Step 2: ParsBERT Parsing (if no match from dataset)
    if (!updates) {
      updates = await parseWithParsBERT(inputText);
    }

    // Step 3: Regex Parsing as Fallback
    if (!updates) {
      updates = parseInputWithRegex(inputText);
    }

    // Handle invalid or empty updates
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('Failed to parse input into updates.');
    }

    console.log('Applying updates:', updates);

    // Update JSON Data
    deepUpdate(jsonData, updates);

    // Save Updated JSON
    saveJson(filePath, jsonData);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error in POST handler:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Processing failed', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
