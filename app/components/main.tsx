'use client'
import React, { useEffect, useState } from 'react'
import { Preview } from './preview';
import { Form } from './form';
import data from '../../public/template/null.json'
import {Layout }from '../../lib/types'


export const Main = () => {
  const Data = data as unknown as Layout;
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<Layout>(Data);
  const [selectedComponent, setSelectedComponent] = useState<string>('sectionHeader');

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('/api/your-endpoint'); // Replace with your API endpoint
    //     const jsonData = await response.json();
    //     setLoading(false);
    //   } catch (error) {
        
    //   }
    // };
    setLoading(false);
    // fetchData();
  }, []);
  

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