'use client'
import React, { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const target = "kitab"

  const handleInput = (e: any) => {
    const val = e.target.value
    setInput(val)
    if (val.trim() === target) {
      setScore(score + 1)
      setInput('')
    }
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Oyunu 🚀</h1>
      <p>Sözü yazın: <b>{target}</b></p>
      <p>Xal: {score}</p>
      <input 
        value={input} 
        onChange={handleInput} 
        placeholder="Bura yazın..."
        style={{ padding: '10px', fontSize: '18px' }} 
      />
    </div>
  )
}
