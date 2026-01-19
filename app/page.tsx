'use client'
import React, { useState, useEffect } from 'react'

export default function Home() {
  const [gameMode, setGameMode] = useState('test');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#3182ce' }}>Yazma Dünyası 🚀</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setGameMode('test')}
          style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}
        >
          Klassik Test
        </button>
        <button 
          onClick={() => setGameMode('shooter')}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#e53e3e', color: 'white', border: 'none' }}
        >
          Qırıcı Oyunu
        </button>
      </div>

      <div style={{ border: '2px solid #ccc', padding: '40px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        {gameMode === 'test' ? (
          <div>
            <h2>Klassik Yazma Testi</h2>
            <p>Sözləri sürətli yazmağa hazırlaş!</p>
          </div>
        ) : (
          <div>
            <h2 style={{ color: '#e53e3e' }}>Qırıcı Rejimi Aktivdir!</h2>
            <p>Xal: {score}</p>
            <div style={{ height: '100px', border: '1px dashed red', margin: '10px 0' }}>
              Düşmənlər bura gələcək...
            </div>
          </div>
        )}
      </div>

      <input 
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Yazmağa başlayın..."
        style={{ marginTop: '20px', padding: '15px', width: '300px', fontSize: '18px' }}
      />
    </div>
  );
}
