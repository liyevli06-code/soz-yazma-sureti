'use client'
import React, { useState, useEffect, useRef } from 'react'

const WORDS = ["kitab", "kompüter", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "ekran", "kod", "tətbiq", "uğur", "dünya", "elm", "həyat", "vaxt", "dəqiqə", "siçan", "hədəf"];

export default function App() {
  const [mode, setMode] = useState<'test' | 'shooter'>('test');
  const [userInput, setUserInput] = useState('');
  const [enemies, setEnemies] = useState<{ id: number, word: string, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Qırıcı Oyunu Logikası
  useEffect(() => {
    if (mode === 'shooter' && !gameOver) {
      const moveInterval = setInterval(() => {
        setEnemies(prev => {
          const updated = prev.map(e => ({ ...e, y: e.y + 2 }));
          if (updated.some(e => e.y > 90)) setGameOver(true);
          return updated;
        });
      }, 100);

      const spawnInterval = setInterval(() => {
        setEnemies(prev => [...prev, {
          id: Date.now(),
          word: WORDS[Math.floor(Math.random() * WORDS.length)],
          x: Math.random() * 80 + 5,
          y: 0
        }]);
      }, 2000);

      return () => { clearInterval(moveInterval); clearInterval(spawnInterval); };
    }
  }, [mode, gameOver]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setUserInput(e.target.value);

    if (mode === 'shooter') {
      const hit = enemies.find(e => e.word === val);
      if (hit) {
        setEnemies(prev => prev.filter(e => e.id !== hit.id));
        setScore(prev => prev + 10);
        setUserInput('');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Dünyası</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button onClick={() => {setMode('test'); setGameOver(false)}} style={{ padding: '10px', cursor: 'pointer', backgroundColor: mode === 'test' ? '#48bb78' : '#eee', color: mode === 'test' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}>Test Rejimi</button>
        <button onClick={() => {setMode('shooter'); setGameOver(false); setEnemies([]); setScore(0)}} style={{ padding: '10px', cursor: 'pointer', backgroundColor: mode === 'shooter' ? '#e74c3c' : '#eee', color: mode === 'shooter' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}>Qırıcı Oyunu 🚀</button>
      </div>

      {mode === 'shooter' ? (
        <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#1a202c', borderRadius: '15px', overflow: 'hidden', border: '4px solid #2d3748' }}>
          {gameOver ? (
            <div style={{ color: 'white', paddingTop: '150px' }}>
              <h2>OYUN BİTDİ! ❌</h2>
              <p style={{ fontSize: '24px' }}>Xalınız: {score}</p>
              <button onClick={() => {setGameOver(false); setEnemies([]); setScore(0)}} style={{ padding: '10px 20px', cursor: 'pointer' }}>Yenidən Başla</button>
            </div>
          ) : (
            <>
              <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#48bb78', fontWeight: 'bold' }}>XAL: {score}</div>
              {enemies.map(enemy => (
                <div key={enemy.id} style={{ position: 'absolute', left: `${enemy.x}%`, top: `${enemy.y}%`, backgroundColor: 'white', padding: '5px 12px', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  {enemy.word}
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div style={{ padding: '40px', background: '#f7fafc', borderRadius: '15px', border: '2px solid #e2e8f0' }}>
          <p style={{ fontSize: '20px' }}>Klassik test üçün bura sözləri əlavə edə bilərsən.</p>
        </div>
      )}

      <input
        type="text"
        value={userInput}
        onChange={handleInput}
        placeholder={mode === 'shooter' ? "Sözü yaz və qırıcını vur!" : "Yazmağa başlayın..."}
        style={{ width: '10
