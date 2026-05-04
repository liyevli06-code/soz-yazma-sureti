'use client'
import React, { useState, useEffect, useRef } from 'react'

const EASY_WORDS = ["kitab", "universitet", "düşüncə", "fəaliyyət", "sayt", "server", "imtahan", "kompüter", "proqramlaşdırma", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "öyrənmək", "ekran", "siçan", "kod", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "gələcək", "elm", "məqsəd", "həyat", "tələbə", "müəllim", "vaxt", "saniyə", "dəqiqə", "klaviş", "məkan", "zaman", "şəhər", "qələm", "dəftər", "bilik", "sevgi", "vətən", "bayraq", "səma", "dəniz", "yağış", "günəş", "bulud", "bahar", "çiçək", "meyvə", "səhər", "axşam", "gecə", "insan", "ailə", "dost", "yoldaş", "hərf", "cümlə", "mətn", "səhifə", "kitabxana", "lüğət", "mədəniyyət", "iqtisadiyyat", "ədəbiyyat", "riyaziyyat", "müstəqillik", "demokratiya", "respublika", "təhlükəsizlik", "əməkdaşlıq", "yaradıcılıq", "təşəbbüs", "müasirlik", "gənclik", "təcrübə", "müvəffəqiyyət"];
const HARD_WORDS = ["müvəffəqiyyətsizliklərimizdən", "elektroenergetika", "proqramlaşdırılma", "təkmilləşdirilməyən", "istiqamətləndiricilər", "fərdiləşdirilməmiş", "beynəlxalqlaşdırılma", "məsuliyyətsizlik", "xarakterizəolunma", "mərkəzləşdirilməmiş", "sənayeləşdirilmə", "universitetlərarası", "mükəmməlləşdirilmə", "mütəşəkkilləşdirilmiş", "sabitləşdiricilər", "radioteleviziya", "hüquqşünaslıq", "elektromaqnit", "demokratikləşdirilmə", "avtomatlaşdırılma", "konseptuallaşdırma", "mikrobiologiya", "kristallaşdırılma", "transformasiya", "differensiallaşma", "mütəxəssisləşdirilmə", "standartlaşdırılma"];
const CODE_WORDS = ["const", "function", "useEffect", "useState", "interface", "export default", "return", "console.log", "async", "await", "import React", "map((item) =>", "filter", "reduce", "Component", "props", "className", "styles", "module.exports", "git commit", "npm install"];

export default function TypingApp() {
  const [appMode, setAppMode] = useState<'easy' | 'hard' | 'shooter' | 'code'>('easy');
  const [userInput, setUserInput] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Dark Mode üçün state
  
  const [enemies, setEnemies] = useState<{ id: number, word: string, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetTest();
    let source;
    if (appMode === 'easy') source = EASY_WORDS;
    else if (appMode === 'hard') source = HARD_WORDS;
    else if (appMode === 'code') source = CODE_WORDS;
    else source = EASY_WORDS;

    if (appMode !== 'shooter') {
      setWordList([...source].sort(() => Math.random() - 0.5));
    }
  }, [appMode]);

  const resetTest = () => {
    setUserInput('');
    setTimeLeft(60);
    setIsActive(false);
    setTestEnded(false);
    setEnemies([]);
    setScore(0);
  };

  const playClickSound = () => {
    if (soundEnabled) {
      const audio = new Audio('https://www.soundjay.com/communication/typewriter-key-1.mp3');
      audio.volume = 0.1;
      audio.play().catch(() => {}); // Brauzer bloklamasın deyə catch əlavə edildi
    }
  };

  useEffect(() => {
    if (appMode !== 'shooter' && scrollRef.current) {
      const activeChar = scrollRef.current.querySelector('.active-char') as HTMLElement;
      if (activeChar) {
        scrollRef.current.scrollTop = activeChar.offsetTop - 40;
      }
    }
  }, [userInput, appMode]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0 && !testEnded) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setTestEnded(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, testEnded]);

  useEffect(() => {
    let moveInterval: any;
    let spawnInterval: any;

    if (appMode === 'shooter' && isActive && !testEnded) {
      moveInterval = setInterval(() => {
        setEnemies(prev => {
          const updated = prev.map(e => ({ ...e, y: e.y + 1.2 })); // Sürət bir az tənzimləndi
          if (updated.some(e => e.y > 90)) {
            setTestEnded(true);
            setIsActive(false);
          }
          return updated;
        });
      }, 100);

      spawnInterval = setInterval(() => {
        setEnemies(prev => [...prev, {
          id: Date.now(),
          word: EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)],
          x: Math.random() * 70 + 10,
          y: 0
        }]);
      }, 2000);
    }

    return () => {
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
    };
  }, [appMode, isActive, testEnded]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive && !testEnded) setIsActive(true);
    const val = e.target.value;
    setUserInput(val);
    playClickSound();

    if (appMode === 'shooter') {
      const hitEnemy = enemies.find(en => en.word === val.trim());
      if (hitEnemy) {
        setEnemies(prev => prev.filter(en => en.id !== hitEnemy.id));
        setScore(s => s + 10);
        setUserInput('');
      }
    }
  };

  const userWords = userInput.trim().split(/\s+/);
  const correct = appMode === 'shooter' ? score : userWords.filter((w, i) => w === wordList[i]).length;
  const wrong = appMode === 'shooter' ? 0 : userWords.filter((w, i) => w !== "" && w !== wordList[i]).length;
  const accuracy = userInput.length > 0 ? Math.round((correct / (correct + (wrong / 5) || 1)) * 100) : 100;

  const getStatus = () => {
    if (appMode === 'shooter') {
      if (score <= 50) return "Piyada 🛡️";
      if (score <= 150) return "Snayper 🎯";
      if (score <= 300) return "Komandir 🎖️";
      return "Baş Komandan 👑";
    } else {
      if (correct <= 20) return "Başlanğıc 🐢";
      if (correct <= 30) return "Orta ⌨️";
      if (correct <= 40) return "Peşəkar 🚀";
      if (correct <= 60) return "Ekspert 🔥";
      return "Əfsanəvi 👑";
    }
  };

  // Dinamik rənglər
  const theme = {
    bg: darkMode ? '#1a202c' : '#f7fafc',
    card: darkMode ? '#2d3748' : '#ffffff',
    text: darkMode ? '#f7fafc' : '#2d3748',
    border: darkMode ? '#4a5568' : '#e2e8f0',
    inputBg: darkMode ? '#2d3748' : '#fff'
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '850px', 
      margin: '0 auto', 
      textAlign: 'center', 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', 
      backgroundColor: theme.bg, 
      color: theme.text,
      minHeight: '100vh', 
      borderRadius: '20px',
      transition: 'all 0.3s ease'
    }}>
      
      {/* Header və Ayarlar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Az Yaz 🚀</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '8px 12px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: theme.card, color: theme.text, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {darkMode ? "☀️ İşıqlı" : "🌙 Qaranlıq"}
          </button>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ padding: '8px 12px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: soundEnabled ? '#4299e1' : theme.card, color: soundEnabled ? 'white' : theme.text, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {soundEnabled ? "🔊 Səs" : "🔇 Səs"}
          </button>
        </div>
      </div>

      {/* Rejim Seçimi */}
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {(['easy', 'hard', 'code', 'shooter'] as const).map((mode) => (
          <button 
            key={mode}
            onClick={() => setAppMode(mode)} 
            style={{ 
              padding: '10px 20px', 
              borderRadius: '12px', 
              border: 'none', 
              cursor: 'pointer', 
              backgroundColor: appMode === mode ? '#3182ce' : theme.card, 
              color: appMode === mode ? 'white' : theme.text, 
              fontWeight: 'bold',
              transition: 'transform 0.1s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {mode === 'easy' && "Asan"}
            {mode === 'hard' && "Çətin"}
            {mode === 'code' && "Kod </>"}
            {mode === 'shooter' && "Qırıcı 🚀"}
          </button>
        ))}
      </div>
      
      {/* Timer Progress Bar */}
      {isActive && (
        <div style={{ width: '100%', height: '6px', background: theme.border, borderRadius: '10px', marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ width: `${(timeLeft / 60) * 100}%`, height: '100%', background: timeLeft < 10 ? '#f56565' : '#48bb78', transition: 'width 1s linear' }}></div>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {appMode === 'shooter' ? (
          <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#0f172a', borderRadius: '20px', overflow: 'hidden', border: '4px solid #1e293b', marginBottom: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
             {testEnded ? (
               <div style={{ color: 'white', paddingTop: '150px' }}>
                 <h2 style={{ fontSize: '32px' }}>OYUN BİTDİ! ❌</h2>
                 <p style={{ fontSize: '20px' }}>Topladığın xal: {score}</p>
               </div>
             ) : (
               enemies.map(en => (
                 <div key={en.id} style={{ position: 'absolute', top: en.y + '%', left: en.x + '%', background: '#fff', color: '#1a202c', padding: '6px 15px', borderRadius: '10px', fontWeight: 'bold', boxShadow: '0 0 15px rgba(66, 153, 225, 0.5)', transition: 'top 0.1s linear' }}>
                   {en.word}
                 </div>
               ))
             )}
          </div>
        ) : (
          <div ref={scrollRef} style={{ background: theme.card, padding: '30px', borderRadius: '20px', border: `2px solid ${theme.border}`, marginBottom: '25px', fontSize: '28px', textAlign: 'left', height: '140px', overflow: 'hidden', lineHeight: '1.8', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ color: darkMode ? '#4a5568' : '#cbd5e0', fontWeight: 500 }}>
              {wordList.join(' ').split('').map((char, index) => {
                let color = darkMode ? '#4a5568' : '#cbd5e0';
                let isCurrent = index === userInput.length;
                let isCorrect = userInput[index] === char;
                
                if (index < userInput.length) {
                  color = isCorrect ? '#48bb78' : '#f56565';
                }
                
                return (
                  <span key={index} className={isCurrent ? 'active-char' : ''} style={{ 
                    color, 
                    backgroundColor: isCurrent ? (darkMode ? '#2c5282' : '#ebf8ff') : 'transparent', 
                    borderBottom: isCurrent ? '3px solid #4299e1' : 'none',
                    padding: '0 1px',
                    transition: 'all 0.1s'
                  }}>
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <input
        type="text"
        style={{ 
          width: '100%', 
          padding: '20px', 
          fontSize: '22px', 
          borderRadius: '15px', 
          border: `2px solid #4299e1`, 
          outline: 'none', 
          backgroundColor: theme.inputBg,
          color: theme.text,
          boxShadow: '0 10px 15px -3px rgba(66, 153, 225, 0.1)',
          transition: 'all 0.2s'
        }}
        value={userInput}
        onChange={handleInput}
        disabled={testEnded}
        placeholder={appMode === 'shooter' ? "Sözü yaz və atəş aç! 🔫" : "Yazmağa başla..."}
        autoFocus
      />

      <div style={{ marginTop: '25px', fontSize: '20px', display: 'flex', justifyContent: 'space-around', fontWeight: 'bold' }}>
        <div>⏱️ <span style={{ color: timeLeft < 10 ? '#f56565' : theme.text }}>{timeLeft}s</span></div>
        {appMode === 'shooter' ? <div>🎯 {score}</div> : (
          <>
            <div style={{ color: '#48bb78' }}>✅ {correct}</div>
            <div style={{ color: '#4299e1' }}>📈 {accuracy}%</div>
          </>
        )}
      </div>

      {testEnded && (
        <div style={{ 
          marginTop: '30px', 
          padding: '40px', 
          background: theme.card, 
          borderRadius: '25px', 
          border: '3px solid #4299e1', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' 
        }}>
          <h2 style={{ color: '#4299e1', marginBottom: '20px', fontSize: '28px' }}>Nəticə ✨</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left', maxWidth: '400px', margin: '0 auto 30px auto', fontSize: '18px' }}>
            <span>Sürət:</span> <b>{appMode === 'shooter' ? `${score} Xal` : `${correct} WPM`}</b>
            <span>Səhvlər:</span> <b style={{ color: '#f56565' }}>{wrong}</b>
            <span>Dəqiqlik:</span> <b>{accuracy}%</b>
            <span>Səviyyə:</span> <b style={{ color: '#4299e1' }}>{getStatus()}</b>
          </div>
          <button 
            onClick={resetTest} 
            style={{ 
              padding: '16px 50px', 
              cursor: 'pointer', 
              borderRadius: '15px', 
              border: 'none', 
              background: '#4299e1', 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '20px', 
              boxShadow: '0 10px 15px rgba(66, 153, 225, 0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Yenidən Başla
          </button>
        </div>
      )}
    </div>
  )
}
