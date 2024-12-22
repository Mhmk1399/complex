import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const  inputdata  = await req.json();
    console.log('Received input:', inputdata);
    const { userInput } = inputdata;
    console.log('Received input:', userInput);

    const ollamaRequest = {
      model: 'llama2',
      prompt: `You are a JSON transformer for styling properties.
              Transform this styling request: "${userInput}" to a valid JSON format.
              
              Example inputs and outputs:
              Input: "رنگ پس زمینه رو قرمز کن"
              Output: {"backgroundColor": "#FF0000"}
              
              Input: "فونت متن رو بزرگ کن"
              Output: {"fontSize": "32px"}
              
              Input: "حاشیه رو گرد کن"
              Output: {"borderRadius": "8px"}
              
              Format your response as a direct JSON object without any explanation or markdown.
              Use values similar to this template:
              {
                "backgroundColor": "#14213D",
                "fontSize": "32px",
                "fontWeight": "bold",
                "borderRadius": "8px",
                "padding": "20px",
                "margin": "10px",
                "color": "#FCA311"
              }`,
      stream: false,
    };

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaRequest),
    });

    const data = await response.json();
    console.log('Ollama raw response:', data);

    // Extract only the JSON part from the response
    const jsonMatch = data.response.match(/\{[^]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const jsonResponse = JSON.parse(jsonMatch[0]);
    console.log('Parsed JSON response:', jsonResponse);

    return NextResponse.json({ success: true, data: jsonResponse });

  } catch (error: unknown) {
    console.error('Error details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process input', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}