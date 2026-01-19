'use client'
import React, { useState, useEffect } from 'react'

const WORDS = ["kitab", "universitet", "düşüncə", "fəaliyyət", "sayt", "server", "imtahan", "kompüter", "proqramlaşdırma", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "öyrənmək", "ekran", "siçan", "kod", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "gələcək", "elm", "məqsəd", "həyat", "tələbə", "müəllim", "vaxt", "saniyə", "dəqiqə", "klaviş"];

export default function TypingTest() {
  const [userInput, setUserInput] = useState('')
  const [wordList, setWordList] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [testEnded, setTestEnded] = useState(false)

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
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const calculateResults = () => {
    const userWords = userInput.trim().split(/\s+/);
    const targetWords = wordList;
    let correct = 0;
    let wrong = 0;

    // Yalnız yazılan hissəni yoxlayırıq
    userWords.forEach((word, index) => {
      if (word === targetWords[index]) {
        correct++;
      } else if (word !== "") {
        wrong++;
      }
    });
    return { correct, wrong };
  };

  const { correct, wrong } = calculateResults();
  const targetText = wordList.join(' ');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Testi</h1>
      
      <div style={{ 
        background: '#f9f9f9', padding: '20px', borderRadius: '10px', border: '1px solid #ddd',
        marginBottom: '20px', fontSize: '22px', textAlign: 'left', height: '150px', overflowY: 'auto'
      }}>
        {targetText.split('').map((char, index) => {
          let color = '#ccc';
          if (index < userInput.length) {
            color = userInput[index] === char ? '#2ecc71' : '#e74c3c';
          }
          return <span key={index} style={{ color }}>{char}</span>;
        })}
      </div>

      <input
        type="text"
        style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '8px', border: '2px solid #0070f3' }}
        value={userInput}
        onChange={(e) => {
          if (!isActive && !testEnded) setIsActive(true);
          setUserInput(e.target.value);
        }}
        disabled={testEnded}
        placeholder="Sözləri olduğu kimi yazın..."
      />

      <div style={{ marginTop: '20px', fontSize: '20px' }}>Vaxt: <b>{timeLeft}s</b></div>

      {testEnded && (
        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #2ecc71', borderRadius: '10px' }}>
          <h3>Nəticə:</h3>
          <p>Düzgün yazılan sözlər: <b style={{color: 'green'}}>{correct}</b></p>
          <p>Səhv yazılan və ya ötürülən: <b style={{color: 'red'}}>{wrong}</b></p>
        </div>
      )}

      <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 25px', cursor: 'pointer' }}>
        Yenidən Başla
      </button>
    </div>
  )
}
