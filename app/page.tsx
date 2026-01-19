'use client'
import React, { useState, useEffect, useRef } from 'react'

const WORDS = ["kitab", "kompüter", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "ekran", "kod", "tətbiq", "uğur", "dünya", "elm", "həyat", "vaxt", "dəqiqə", "siçan", "hədəf"];

export default function TypingGame() {
  const [gameMode, setGameMode] = useState<'test' | 'shooter'>('test');
  const [enemies, setEnemies] = useState<{ id: number, word: string, x: number, y: number }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const requestRef = useRef<number>();

  // Qırıcı oyunu üçün düşmən yaratma
  useEffect(() => {
    if (gameMode === 'shooter' && !gameOver) {
      const interval = setInterval(() => {
        const newEnemy = {
          id: Date.now(),
          word: WORDS[Math.floor(Math.random() * WORDS.length)],
          x: Math.random() * 80 + 10, // 10% - 90% arası təsadüfi yer
          y: 0
        };
        setEnemies(prev => [...prev, newEnemy]);
      }, 2000); // Hər 2 saniyədən bir yeni düşmən
      return () => clearInterval(interval);
    }
  }, [gameMode, gameOver]);

  // Düşmənlərin hərəkəti
  const updateEnemies = () => {
    setEnemies(prev => {
      const updated = prev.map(e => ({ ...e, y: e.y + 0.5 }));
      if (updated.some(e => e.y > 90)) {
        setGameOver(true);
        return updated;
      }
      return updated;
    });
    requestRef.current = requestAnimationFrame(updateEnemies);
  };

  useEffect(() => {
    if (gameMode === 'shooter' && !gameOver) {
      requestRef.current = requestAnimationFrame(updateEnemies);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameMode, gameOver]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setInputValue(e.target.value);

    if (gameMode === 'shooter') {
      const targetEnemy = enemies.find(e => e.word === val);
      if (targetEnemy) {
        setEnemies(prev => prev.filter(e => e.id !== targetEnemy.id));
        setScore(s => s + 10);
        setInputValue('');
      }
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Dünyası</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => {setGameMode('test'); setGameOver(false)}} style={{marginRight: '10px', padding: '10px'}}>Klassik Test</button>
        <button onClick={() => {setGameMode('shooter'); setGameOver(false); setEnemies([]); setScore(0)}} style={{padding: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px'}}>Qırıcı Oyunu 🚀</button>
      </div>

      {gameMode === 'shooter' ? (
        <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#2c3e50', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
          {gameOver ? (
            <div style={{ color: 'white', marginTop: '150px' }}>
              <h2>OYUN BİTDİ!</h2>
              <p>Xal: {score}</p>
              <button onClick={() => {setGameOver(false); setEnemies([]); setScore(0)}} style={{padding: '10px'}}>Yenidən Başla</button>
            </div>
          ) : (
            <>
              <div style={{ position: 'absolute', top: '10px', right: '10px', color: 'white' }}>Xal: {score}</div>
              {enemies.map(enemy => (
                <div key={enemy.id} style={{
                  position: 'absolute', left: `${enemy.x}%`, top: `${enemy.y}%`,
                  backgroundColor: '#ecf0f1', padding: '5px 10px', borderRadius: '5px',
                  fontWeight: 'bold', transition: 'top 0.1s linear'
                }}>
                  {enemy.word}
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <p>Klassik test rejimi buradadır...</p>
      )}

      {!gameOver && (
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
          placeholder="Sözü yaz və qırıcını vur!"
          style={{ width: '300px', padding: '10px', fontSize: '18px' }}
        />
      )}
    </div>
  );
}
