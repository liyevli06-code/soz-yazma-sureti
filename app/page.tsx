'use client'

import React, { useState } from 'react'

export default function Page() {
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [mode, setMode] = useState('test')

  const word = "Azərbaycan"

  const checkInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    if (value.trim() === word) {
      setScore(score + 1)
      setInput('')
    }
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Oyunu 🚀</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setMode('test')} style={{ padding: '10px', marginRight: '10px' }}>Test</button>
        <button onClick={() => setMode('shooter')} style={{ padding: '10px' }}>Qırıcı</button>
      </div>

      <div style={{ border: '2px solid #3182ce', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        {mode === 'test' ? (
          <div>
            <h2>Sözü yaz: <span style={{ color: 'blue' }}>{word}</span></h2>
            <p>Xal: {score}</p>
          </div>
        ) : (
          <div>
            <h2 style={{ color: 'red' }}>Qırıcı Rejimi</h2>
            <p>Çox yaxında əlavə olunacaq!</p>
          </div>
        )}
      </div>

      <input 
        type="text" 
        value={input} 
        onChange={checkInput} 
        placeholder="Bura yazın..."
        style={{ padding: '10px', width: '250px', fontSize: '18px' }}
      />
    </div>
  )
}
