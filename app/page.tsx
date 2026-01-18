'use client'
import React, { useState, useEffect } from 'react'

const WORDS = ["kitab", "kompüter", "proqramlaşdırma", "internet", "sürət","hüseyin xıyardı", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "öyrənmək", "ekran", "siçan", "kod", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "gələcək", "elm", "məqsəd", "həyat", "tələbə", "müəllim", "vaxt", "saniyə", "dəqiqə", "klaviş", "təhsil", "inkişaf"];

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
      if (word === targetWords[index]) correct++;
      else wrong++;
    });
    setStats({ correct, wrong });
  };

  const targetText = wordList.join(' ');

  return (
    <div style={{ 
      padding: '15px', 
      maxWidth: '900px', 
      margin: '0 auto', 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ fontSize: 'calc(18px + 1vw)', textAlign: 'center', color: '#333' }}>
        Azərbaycanca Yazma Testi
      </h1>
      
      {/* Mətn Qutusu - Ekran ölçüsünə görə hündürlüyü dəyişir */}
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '12px', 
        border: '2px solid #eef2f7',
        marginBottom: '15px', 
        fontSize: 'calc(16px + 0.5vw)', 
        lineHeight: '1.6', 
        textAlign: 'left', 
        height: '180px', 
        overflowY: 'auto',
        wordBreak: 'break-word',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ color: '#bbb' }}>
          {targetText.split('').map((char, index) => {
            let color = '#bbb';
            if (index < userInput.length) {
              color = userInput[index] === char ? '#2ecc71' : '#e74c3c';
            }
            return (
              <span key={index} style={{ 
                color, 
                textDecoration: color === '#e74c3c' ? 'underline' : 'none',
                backgroundColor: index === userInput.length ? '#d1e7ff' : 'transparent' 
              }}>
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Giriş sahəsi */}
      <input
        type="text"
        autoCapitalize="none"
        style={{ 
          width: '100%', 
          padding: '15px', 
          fontSize: '18px', 
          borderRadius: '10px', 
          border: '2px solid #0070f3', 
          boxSizing: 'border-box',
          boxShadow: '0 2px 8px rgba(0,112,243,0.1)',
          outline: 'none'
        }}
        value={userInput}
        onChange={(e) => {
          if (!isActive && !testEnded) setIsActive(true);
          setUserInput(e.target.value);
        }}
        disabled={testEnded}
        placeholder="Yazmağa başlayın..."
      />

      {/* Vaxt və Hesabat */}
      <div style={{ 
        marginTop: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ fontSize: '20px' }}>
          ⏳ Vaxt: <b style={{ color: timeLeft < 10 ? '#e74c3c' : '#333' }}>{timeLeft} saniyə</b>
        </div>
        
        {testEnded && (
          <div style={{ 
            padding: '15px', 
            background: '#fff', 
            borderRadius: '10px', 
            border: '1px solid #2ecc71',
            flexGrow: 1,
            textAlign: 'center'
          }}>
            <span style={{ color: 'green' }}>Düz: <b>{stats.correct}</b></span> | 
            <span style={{ color: 'red' }}> Səhv: <b>{stats.wrong}</b></span> | 
            <span> Sürət: <b>{stats.correct} wpm</b></span>
          </div>
        )}
      </div>

      <button 
        onClick={() => window.location.reload()} 
        style={{ 
          marginTop: 'auto', 
          marginBottom: '20px',
          padding: '15px', 
          background: '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '10px', 
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          transition: 'background 0.3s'
        }}
      >
        Yenidən Başla
      </button>
    </div>
  )
}
