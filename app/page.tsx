'use client'
import React, { useState, useEffect } from 'react'

export default function Home() {
  const [mode, setMode] = useState<'test' | 'shooter'>('test')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [enemies, setEnemies] = useState<{ id: number; word: string; y: number; x: number }[]>([])
  const [gameOver, setGameOver] = useState(false)

  const words = ["kitab", "kod", "ekran", "sürət", "uğur", "bilgi", "hədəf"]

  // Qırıcı Oyunu Mexanikası
  useEffect(() => {
    if (mode === 'shooter' && !gameOver) {
      const interval = setInterval(() => {
        setEnemies(prev => {
          const moved = prev.map(e => ({ ...e, y: e.y + 2 }))
          if (moved.some(e => e.y > 90)) setGameOver(true)
          return moved
        })
      }, 100)
      
      const spawn = setInterval(() => {
        const newEnemy = {
          id: Date.now(),
          word: words[Math.floor(Math.random() * words.length)],
          x: Math.random() * 80 + 10,
          y: 0
        }
        setEnemies(prev => [...prev, newEnemy])
      }, 2000)

      return () => { clearInterval(interval); clearInterval(spawn) }
    }
  }, [mode, gameOver])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim()
    setInput(e.target.value)
    if (mode === 'shooter') {
      const hit = enemies.find(en => en.word === val)
      if (hit) {
        setEnemies(prev => prev.filter(en => en.id !== hit.id))
        setScore(s => s + 10)
        setInput('')
      }
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Dünyası 🚀</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => {setMode('test'); setGameOver(false)}} style={{ padding: '10px', marginRight: '10px' }}>Test</button>
        <button onClick={() => {setMode('shooter'); setGameOver(false); setEnemies([]); setScore(0)}} style={{ padding: '10px', background: 'red', color: 'white', border: 'none' }}>Qırıcı Oyunu</button>
      </div>

      {mode === 'shooter' ? (
        <div style={{ position: 'relative', height: '400px', background: '#222', borderRadius: '10px', overflow: 'hidden' }}>
          {gameOver ? <h2 style={{ color: 'white', paddingTop: '150px' }}>OYUN BİTDİ! Xal: {score}</h2> : (
            enemies.map(en => (
              <div key={en.id} style={{ position: 'absolute', top: en.y + '%', left: en.x + '%', background: 'white', padding: '5px', borderRadius: '5px', fontWeight: 'bold' }}>
                {en.word}
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={{ padding: '40px', background: '#f0f0f0', borderRadius: '10px' }}>
          <h2>Test Rejimi Aktivdir</h2>
          <p>Yazma bacarığını yoxla!</p>
        </div>
      )}

      <input 
        type="text" 
        value={input} 
        onChange={handleInput} 
        placeholder="Sözü yazın..." 
        style={{ marginTop: '20px', padding: '10px', width: '250px' }}
      />
    </div>
  )
}
