"use client"
import React from 'react'
import ProductList from '../components/sections/productList'

const Test = () => {
  const [selectedComponent, setSelectedComponent] = React.useState(null)
  const [layout, setLayout] = React.useState('grid')
  const actualName = 'Test'

  return (
    <div>
        <ProductList
          
        />
    </div>
  )
}

export default Test