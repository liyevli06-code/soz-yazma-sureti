'use client'
import React, { useState, useEffect } from 'react'

const WORDS = ["kitab", "kompüter", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "ekran", "kod", "tətbiq", "uğur", "dünya", "elm", "həyat", "vaxt", "dəqiqə"];

export default function TypingGame() {
  const [mode, setMode] = useState<'test' | 'shooter'>('test');
  const [userInput, setUserInput] = useState('');
  const [enemies, setEnemies] = useState<{ id: number, word: string, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (mode === 'shooter' && !gameOver) {
      const spawn = setInterval(() => {
        setEnemies(prev => [...prev, {
          id: Date.now(),
          word: WORDS[Math.floor(Math.random() * WORDS.length)],
          x: Math.random() * 80 + 5,
          y: 0
        }]);
      }, 2000);

      const move = setInterval(() => {
        setEnemies(prev => {
          const updated = prev.map(e => ({ ...e, y: e.y + 1 }));
          if (updated.some(e => e.y > 90)) setGameOver(true);
          return updated;
        });
      }, 50);

      return () => { clearInterval(spawn); clearInterval(move); };
    }
  }, [mode, gameOver]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setUserInput(e.target.value);
    if (mode === 'shooter') {
      const hit = enemies.find(en => en.word === val);
      if (hit) {
        setEnemies(prev => prev.filter(en => en.id !== hit.id));
        setScore(s => s + 10);
        setUserInput('');
      }
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Oyunu</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => {setMode('test'); setGameOver(false)}}>Test</button>
        <button onClick={() => {setMode('shooter'); setGameOver(false); setEnemies([]); setScore(0)}}>Qırıcı</button>
      </div>

      {mode === 'shooter' ? (
        <div style={{ position: 'relative', height: '400px', background: '#333', overflow: 'hidden', color: 'white' }}>
          {gameOver ? <div><h2>OYUN
