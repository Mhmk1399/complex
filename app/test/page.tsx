"use client"
import { useState } from 'react';

export default function Home() {
  const [json, setJson] = useState(null);
  const [inputText, setInputText] = useState('');

  const handleInput = async () => {
    const response = await fetch('/api/update-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputText }),
    });
    const updatedJson = await response.json();
    setJson(updatedJson);
};

  return (
    <div style={{ padding: '20px' }}>
      <h1>JSON Editor</h1>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={3}
        style={{ width: '100%' }}
        placeholder="یک جمله فارسی وارد کنید..."
      />
      <button onClick={handleInput} style={{ marginTop: '10px' }}>تبدیل</button>

      <pre style={{ marginTop: '20px', background: '#f4f4f4', padding: '10px' }}>
        {json ? JSON.stringify(json, null, 2) : 'JSON نمایش داده می‌شود'}
      </pre>
    </div>
  );
}