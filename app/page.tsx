'use client'
import React, { useState, useEffect } from 'react'

const WORDS = ["kitab", "kompüter", "proqramlaşdırma", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "öyrənmək", "ekran", "siçan", "kod", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "gələcək", "elm", "məqsəd", "həyat", "tələbə", "müəllim", "vaxt", "saniyə", "dəqiqə", "klaviş"];

export default function TypingTest() {
  const [userInput, setUserInput] = useState('')
  const [wordList, setWordList] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [testEnded, setTestEnded] = useState(false)
  const [stats, setStats] = useState({ correct: 0, wrong: 0 })

  useEffect(() => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    setWordList(shuffled);
  }, [])

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setTestEnded(true);
      calculateStats();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const calculateStats = () => {
    const userWords = userInput.trim().split(/\s+/);
    const targetWords = wordList;
    let correct = 0;
    let wrong = 0;

    userWords.forEach((word, index) => {
      if (word === targetWords[index]) {
        correct++;
      } else {
        wrong++;
      }
    });
    setStats({ correct, wrong });
  };

  const targetText = wordList.join(' ');

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace', textAlign: 'center' }}>
      <h1>Söz Yazma Sürəti</h1>
      
      <div style={{ 
        background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ddd',
        marginBottom: '20px', fontSize: '24px', lineHeight: '35px', textAlign: 'left', minHeight: '150px', wordBreak: 'break-word'
      }}>
        <div style={{ color: '#ccc' }}>
          {targetText.split('').map((char, index) => {
            let color = '#ccc';
            if (index < userInput.length) {
              color = userInput[index] === char ? '#2ecc71' : '#e74c3c';
            }
            return <span key={index} style={{ color, textDecoration: color === '#e74c3c' ? 'underline' : 'none' }}>{char}</span>;
          })}
        </div>
      </div>

      <input
        type="text"
        style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '5px', border: '2px solid #0070f3', outline: 'none' }}
        value={userInput}
        onChange={(e) => {
          if (!isActive && !testEnded) setIsActive(true);
          setUserInput(e.target.value);
        }}
        disabled={testEnded}
        placeholder="Yazmağa başlayın..."
        autoFocus
      />

      <div style={{ marginTop: '20px', fontSize: '20px' }}>Vaxt: <b>{timeLeft}s</b></div>

      {testEnded && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#fdfdfd', borderRadius: '10px', border: '1px solid #0070f3' }}>
          <h2>Nəticə:</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '22px' }}>
            <p style={{ color: 'green' }}>Düzgün: <b>{stats.correct}</b></p>
            <p style={{ color: 'red' }}>Səhv: <b>{stats.wrong}</b></p>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Xalis Sürət: {stats.correct} söz/dəqiqə</p>
        </div>
      )}

      <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 25px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Yenidən Başla
      </button>
    </div>
  )
}
