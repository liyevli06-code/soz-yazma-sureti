'use client'
import React, { useState, useEffect } from 'react'

const EASY_WORDS = [
  "kitab", "universitet", "düşüncə", "fəaliyyət", "sayt", "server", "imtahan", "kompüter", 
  "proqramlaşdırma", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", 
  "məktəb", "öyrənmək", "ekran", "siçan", "kod", "tətbiq", "uğur", "hədəf", "bilgi", 
  "dünya", "gələcək", "elm", "məqsəd", "həyat", "tələbə", "müəllim", "vaxt", "saniyə", 
  "dəqiqə", "klaviş", "məkan", "zaman", "şəhər", "qələm", "dəftər", "bilik", "sevgi", 
  "vətən", "bayraq", "səma", "dəniz", "yağış", "günəş", "bulud", "bahar", "çiçək", 
  "meyvə", "səhər", "axşam", "gecə", "insan", "ailə", "dost", "yoldaş", "hərf", 
  "cümlə", "mətn", "səhifə", "kitabxana", "lüğət", "mədəniyyət", "iqtisadiyyat", 
  "ədəbiyyat", "riyaziyyat", "müstəqillik", "demokratiya", "respublika", 
  "təhlükəsizlik", "əməkdaşlıq", "yaradıcılıq", "təşəbbüs", "müasirlik", "gənclik", 
  "təcrübə", "müvəffəqiyyət"
];

const HARD_WORDS = [
  "müvəffəqiyyətsizliklərimizdən", "elektroenergetika", "proqramlaşdırılma", "təkmilləşdirilməyən", 
  "istiqamətləndiricilər", "fərdiləşdirilməmiş", "beynəlxalqlaşdırılma", "məsuliyyətsizlik", 
  "xarakterizəolunma", "mərkəzləşdirilməmiş", "sənayeləşdirilmə", "universitetlərarası", 
  "mükəmməlləşdirilmə", "mütəşəkkilləşdirilmiş", "sabitləşdiricilər", "radioteleviziya", 
  "hüquqşünaslıq", "elektromaqnit", "demokratikləşdirilmə", "avtomatlaşdırılma", 
  "konseptuallaşdırma", "mikrobiologiya", "kristallaşdırılma", "transformasiya", 
  "differensiallaşma", "mütəxəssisləşdirilmə", "standartlaşdırılma"
];

export default function TypingTest() {
  const [mode, setMode] = useState<'easy' | 'hard'>('easy')
  const [userInput, setUserInput] = useState('')
  const [wordList, setWordList] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [testEnded, setTestEnded] = useState(false)

  useEffect(() => {
    const source = mode === 'easy' ? EASY_WORDS : HARD_WORDS;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    setWordList(shuffled);
    resetTest();
  }, [mode])

  const resetTest = () => {
    setUserInput('');
    setTimeLeft(60);
    setIsActive(false);
    setTestEnded(false);
  }

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

  return (
    <div style={{ 
      padding: '40px 20px', maxWidth: '900px', margin: '0 auto', 
      textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <h1 style={{ color: '#1a202c', marginBottom: '30px' }}>Azərbaycanca Yazma Testi</h1>

      {/* Rejim Seçimi */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={() => setMode('easy')} style={{
          padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 'bold',
          backgroundColor: mode === 'easy' ? '#48bb78' : '#edf2f7',
          color: mode === 'easy' ? 'white' : '#4a5568', transition: '0.3s'
        }}>Asan Rejim</button>
        <button onClick={() => setMode('hard')} style={{
          padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 'bold',
          backgroundColor: mode === 'hard' ? '#f56565' : '#edf2f7',
          color: mode === 'hard' ? 'white' : '#4a5568', transition: '0.3s'
        }}>Çətin Rejim (Uzun Sözlər)</button>
      </div>
      
      {/* Söz Qutusu - Daha geniş və oxunaqlı */}
      <div style={{ 
        background: '#ffffff', padding: '30px', borderRadius: '15px', border: '2px solid #e2e8f0',
        marginBottom: '25px', fontSize: '24px', textAlign: 'left', minHeight: '140px', 
        lineHeight: '1.8', letterSpacing: '0.5px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <div style={{ color: '#a0aec0' }}>
          {wordList.join(' ').split('').map((char, index) => {
            let color = '#a0aec0';
            let bg = 'transparent';
            if (index < userInput.length) {
              color = userInput[index] === char ? '#38a169' : '#e53e3e';
            } else if (index === userInput.length) {
              bg = '#ebf8ff';
              color = '#2b6cb0';
            }
            return <span key={index} style={{ color, backgroundColor: bg, padding: '1px 0', borderRadius: '2px' }}>{char}</span>;
          })}
        </div>
      </div>

      <input
        type="text"
        style={{ 
          width: '100%', padding: '18px', fontSize: '20px', borderRadius: '12px', 
          border: '2px solid #3182ce', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        value={userInput}
        onChange={(e) => {
          if (!isActive && !testEnded) setIsActive(true);
          setUserInput(e.target.value);
        }}
        disabled={testEnded}
        placeholder="Yazmağa başlayın..."
      />

      <div style={{ marginTop: '25px', fontSize: '22px', fontWeight: 'bold' }}>
        Vaxt: <span style={{color: timeLeft < 10 ? '#e53e3e' : '#2d3748'}}>{timeLeft}s</span>
      </div>

      {testEnded && (
        <div style={{ 
          marginTop: '30px', padding: '25px', border: '2px solid #3182ce', 
          borderRadius: '15px', backgroundColor: '#ebf8ff', animation: 'fadeIn 0.5s'
        }}>
          <h2 style={{ color: '#2b6cb0', marginTop: 0 }}>Nəticəniz</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '20px' }}>
            <p>Düzgün: <b style={{color: '#38a169'}}>{correct}</b></p>
            <p>Səhv: <b style={{color: '#e53e3e'}}>{wrong}</b></p>
            <p>Sürət: <b>{correct} wpm</b></p>
          </div>
          <h3 style={{ color: '#2d3748' }}>
            Səviyyə: {
              correct < 20 ? "Zəif (🐢)" :
              correct < 40 ? "Orta (🏃)" :
              correct < 60 ? "Yaxşı (⚡)" : "Mükəmməl (🔥)"
            }
          </h3>
          <button onClick={() => resetTest()} style={{
            marginTop: '15px', padding: '10px 20px', background: '#3182ce', 
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>Yenidən Başla</button>
        </div>
      )}
    </div>
  )
}
