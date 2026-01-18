'use client'
import React, { useState, useEffect } from 'react'

const WORDS = ["kitab", "kompüter", "proqramlaşdırma", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "öyrənmək", "ekran", "siçan", "kod", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "gələcək", "elm"];

export default function TypingTest() {
  const [userInput, setUserInput] = useState('')
  const [wordList, setWordList] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [correctChars, setCorrectChars] = useState(0)
  const [testEnded, setTestEnded] = useState(false)

  // Sözləri qarışdırıb siyahı yaratmaq
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

  const targetText = wordList.join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive && !testEnded) setIsActive(true);
    const value = e.target.value;
    setUserInput(value);

    // Düzgün yazılan hərfləri hesabla
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === targetText[i]) correct++;
    }
    setCorrectChars(correct);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace', textAlign: 'center' }}>
      <h1>Söz Yazma Sürəti</h1>
      
      {/* Sözlərin göründüyü hissə */}
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '10px', 
        border: '1px solid #ddd',
        marginBottom: '20px', 
        fontSize: '24px',
        lineHeight: '35px',
        textAlign: 'left',
        position: 'relative',
        minHeight: '100px',
        wordBreak: 'break-all'
      }}>
        {/* Altda boz rəngdə orijinal mətn */}
        <div style={{ color: '#ccc' }}>
          {targetText.split('').map((char, index) => {
            let color = '#ccc'; // hələ yazılmayanlar
            if (index < userInput.length) {
              color = userInput[index] === char ? '#2ecc71' : '#e74c3c'; // yaşıl və ya qırmızı
            }
            return <span key={index} style={{ color }}>{char}</span>;
          })}
        </div>
      </div>

      <input
        type="text"
        style={{ 
          width: '100%', 
          padding: '15px', 
          fontSize: '18px', 
          borderRadius: '5px', 
          border: '2px solid #0070f3',
          outline: 'none'
        }}
        value={userInput}
        onChange={handleChange}
        disabled={testEnded}
        placeholder="Yazmağa başlayın..."
        autoFocus
      />

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around', fontSize: '20px' }}>
        <div>Vaxt: <b>{timeLeft}s</b></div>
        {testEnded && <div>Sürət: <b>{Math.round((correctChars / 5))} S/D</b></div>}
      </div>

      <button 
        onClick={() => window.location.reload()}
        style={{ marginTop: '30px', padding: '10px 25px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Yenidən Başla
      </button>
    </div>
  )
}
