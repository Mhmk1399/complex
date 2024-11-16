'use client'
import React, { useEffect, useState } from 'react'
import { Preview } from './preview';
import { Form } from './form';
import data from '../../public/template/null.json'
import { Layout } from '../../lib/types'

export const Main = () => {
  const Data = data as unknown as Layout;
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<Layout>(Data);
  const [selectedComponent, setSelectedComponent] = useState<string>('sectionHeader');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/saveLayout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ layout }),
      });

      if (!response.ok) {
        throw new Error('Failed to save layout');
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving layout:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-90 z-50">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="fixed top-3 right-4 ">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`px-4 py-2 rounded-md text-white ${
                saveStatus === 'saving' ? 'bg-gray-400' :
                saveStatus === 'saved' ? 'bg-green-500' :
                saveStatus === 'error' ? 'bg-red-500' :
                'bg-green-500 hover:bg-green-600'
              }`}
            >
              {saveStatus === 'saving' ? 'Saving...' :
               saveStatus === 'saved' ? 'Saved!' :
               saveStatus === 'error' ? 'Error!' :
               'Save Changes'}
            </button>
          </div>
          <Preview 
            layout={layout}
            setSelectedComponent={setSelectedComponent}
          />
          <Form selectedComponent={selectedComponent} setLayout={setLayout} layout={layout} />
        </div>
      )}
    </div>
  )
}
