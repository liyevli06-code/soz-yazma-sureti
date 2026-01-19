'use client'
import React, { useState, useEffect } from 'react'

const EASY_WORDS = ["kitab", "kompüter", "internet", "sürət", "klaviatura", "məktəb", "ekran", "kod", "tətbiq", "uğur", "dünya", "elm", "həyat", "vaxt", "dəqiqə"];
const HARD_WORDS = [
  "müvəffəqiyyətsizliklərimizdən", "elektroenergetika", "proqramlaşdırılma", "təkmilləşdirilməyən", 
  "istiqamətləndiricilər", "fərdiləşdirilməmiş", "beynəlxalqlaşdırılma", "məsuliyyətsizlik", 
  "xarakterizəolunma", "mərkəzləşdirilməmiş", "sənayeləşdirilmə", "universitetlərarası", 
  "mükəmməlləşdirilmə", "mütəşəkkilləşdirilmiş", "sabitləşdiricilər", "radioteleviziya", 
  "hüquqşünaslıq", "elektromaqnit", "demokratikləşdirilmə", "avtomatlaşdırılma", 
  "konseptuallaşdırma", "mikrobiologiya", "kristallaşdırılma", "transformasiya", "differensiallaşma",
  "mütəxəssisləşdirilmə", "standartlaşdırılma" // Yeni əlavə etdiyim çətin sözlər
];

export default function TypingTest() {
  const [mode, setMode] = useState<'easy' | 'hard'>('easy')
  const [userInput, setUserInput] = useState('')
  const [wordList, setWordList] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [testEnded, setTestEnded] = useState(false)

  // Sözləri rejimlərə görə hazırlamaq
  useEffect(() => {
    const source = mode === 'easy' ? EASY_WORDS : HARD_WORDS;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    setWordList(shuffled);
    setUserInput('');
    setTimeLeft(60);
    setIsActive(false);
    setTestEnded(false);
  }, [mode])

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
    let correct = 0;
    let wrong = 0;

    userWords.forEach((word, index) => {
      if (word === wordList[index]) correct++;
      else if (word !== "") wrong++;
    });
    return { correct, wrong };
  };

  const { correct, wrong } = calculateResults();
  const targetText = wordList.join(' ');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Testi</h1>

      {/* Rejim seçimi düymələri */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button 
          onClick={() => setMode('easy')}
          style={{
            padding: '10px 20px', borderRadius: '5px', cursor: 'pointer',
            backgroundColor: mode === 'easy' ? '#2ecc71' : '#eee',
            color: mode === 'easy' ? 'white' : 'black', border: 'none'
          }}
        >Asan Rejim</button>
        <button 
          onClick={() => setMode('hard')}
          style={{
            padding: '10px 20px', borderRadius: '5px', cursor: 'pointer',
            backgroundColor: mode === 'hard' ? '#e74c3c' : '#eee',
            color: mode === 'hard' ? 'white' : 'black', border: 'none'
          }}
        >Çətin Rejim (Uzun Sözlər)</button>
      </div>
      
      <div style={{ 
        background: '#f9f9f9', padding: '20px', borderRadius: '10px', border: '1px solid #ddd',
        marginBottom: '20px', fontSize: mode === 'hard' ? '18px' : '22px', textAlign: 'left', height: '180px', overflowY: 'auto'
      }}>
        {targetText.split('').map((char, index) => {
          let color = '#ccc';
          if (index < userInput.length) {
            color = userInput[index] === char ? '#2ecc71' : '#e74c3c';
          }
          return <span key={index} style={{ color, backgroundColor: index === userInput.length ? '#d1e7ff' : 'transparent' }}>{char}</span>;
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
        placeholder={mode === 'hard' ? "Diqqətli olun, sözlər çox uzundur!" : "Yazmağa başlayın..."}
      />

      <div style={{ marginTop: '20px', fontSize: '20px' }}>Vaxt: <b style={{color: timeLeft < 10 ? 'red' : 'black'}}>{timeLeft}s</b></div>

      {testEnded && (
        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #0070f3', borderRadius: '10px', backgroundColor: '#f0f7ff' }}>
          <h3>Test Bitdi! ({mode === 'easy' ? 'Asan' : 'Çətin'} Rejim)</h3>
          <p>Düzgün: <b style={{color: 'green'}}>{correct}</b></p>
          <p>Səhv: <b style={{color: 'red'}}>{wrong}</b></p>
          <p>Xalis Sürət: <b>{correct} söz/dəq</b></p>
        </div>
      )}

      <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 25px', cursor: 'pointer', background: '#333', color: 'white', borderRadius: '5px', border: 'none' }}>
        Yenidən Başla
      </button>
    </div>
  )
}
