import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import fs from 'fs';
import path from 'path';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

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

// Regex Parsing (keeping your existing regex parser as fallback)
function parseInputWithRegex(input: string) {
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

async function parseWithParsBERT(input: string) {
  try {
    const maskedInput = input.replace(/(رنگ|کالر)/i, '[MASK]');
    const response = await hf.fillMask({
      model: 'HooshvareLab/bert-base-parsbert-uncased',
      inputs: maskedInput,
    });

    // Extract the predictions
    const topPrediction = response[0]?.token_str;
    return { backgroundColor: topPrediction }; // Adjust key mapping as needed
  } catch (error) {
    console.error('ParsBERT parsing failed:', error);
    return null;
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputText } = body;

    const filePath = path.join(process.cwd(), 'public', 'template', 'product.json');
    const jsonData = loadJson(filePath);

    // Try ParsBERT first, fallback to regex
    let updates = await parseWithParsBERT(inputText);
    if (!updates || Object.keys(updates).length === 0) {
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
