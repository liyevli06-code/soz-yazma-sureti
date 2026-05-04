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
  const [darkMode, setDarkMode] = useState(true); // Default olaraq tünd rejim
  
  const [enemies, setEnemies] = useState<{ id: number, word: string, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetTest();
    let source = appMode === 'hard' ? HARD_WORDS : appMode === 'code' ? CODE_WORDS : EASY_WORDS;
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

  // --- SƏS FUNKSİYALARI ---
  const playClickSound = () => {
    if (soundEnabled) {
      const audio = new Audio('https://www.soundjay.com/communication/typewriter-key-1.mp3');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
  };

  const playEnergySound = () => {
    if (soundEnabled) {
      const audio = new Audio('https://www.soundjay.com/button/button-37.mp3');
      audio.volume = 0.08;
      audio.play().catch(() => {});
    }
  };

  const playFireSound = () => {
    if (soundEnabled) {
      const audio = new Audio('https://www.soundjay.com/mechanical/gun-gunshot-01.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  // --- OYUN MƏNTİQİ ---
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
          const updated = prev.map(e => ({ ...e, y: e.y + 1.4 }));
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

    if (appMode === 'shooter') {
      playEnergySound(); // Hər hərf yazanda enerji/lazer səsi
      const hitEnemy = enemies.find(en => en.word === val.trim());
      if (hitEnemy) {
        playFireSound(); // Söz düzgün yazılanda atəş səsi
        setEnemies(prev => prev.filter(en => en.id !== hitEnemy.id));
        setScore(s => s + 10);
        setUserInput('');
      }
    } else {
      playClickSound();
    }
  };

  const userWords = userInput.trim().split(/\s+/);
  const correct = appMode === 'shooter' ? score : userWords.filter((w, i) => w === wordList[i]).length;
  const accuracy = userInput.length > 0 ? Math.round((correct / (correct + (userInput.split(' ').length - correct) || 1)) * 100) : 100;

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    card: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    border: darkMode ? '#334155' : '#e2e8f0',
    input: darkMode ? '#1e293b' : '#fff'
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '900px', 
      margin: '0 auto', 
      textAlign: 'center', 
      fontFamily: '"JetBrains Mono", monospace', 
      backgroundColor: theme.bg, 
      color: theme.text, 
      minHeight: '100vh', 
      transition: 'all 0.3s ease' 
    }}>
      
      {/* Üst Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#3b82f6' }}>AZ YAZ <span style={{ color: theme.text }}>V2</span></h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '12px', borderRadius: '15px', border: 'none', cursor: 'pointer', background: theme.card, color: theme.text, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ padding: '12px 20px', borderRadius: '15px', border: 'none', cursor: 'pointer', background: soundEnabled ? '#3b82f6' : theme.card, color: soundEnabled ? 'white' : theme.text, fontWeight: 'bold' }}>
            {soundEnabled ? "🔊 On" : "🔇 Off"}
          </button>
        </div>
      </div>

      {/* Rejim Seçimləri */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
        {(['easy', 'hard', 'code', 'shooter'] as const).map((mode) => (
          <button 
            key={mode} 
            onClick={() => setAppMode(mode)} 
            style={{ 
              padding: '14px 28px', 
              borderRadius: '16px', 
              border: 'none', 
              cursor: 'pointer', 
              backgroundColor: appMode === mode ? '#3b82f6' : theme.card, 
              color: appMode === mode ? 'white' : theme.text, 
              fontWeight: 800, 
              transition: '0.2s',
              boxShadow: appMode === mode ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none'
            }}>
            {mode.toUpperCase()}
          </button>
        ))}
      </div>
      
      {/* Progress Bar */}
      {isActive && (
        <div style={{ width: '100%', height: '10px', background: theme.border, borderRadius: '10px', marginBottom: '25px', overflow: 'hidden' }}>
          <div style={{ width: `${(timeLeft / 60) * 100}%`, height: '100%', background: timeLeft < 10 ? '#ef4444' : '#10b981', transition: 'width 1s linear' }}></div>
        </div>
      )}

      {/* Oyun Sahəsi */}
      <div style={{ position: 'relative' }}>
        {appMode === 'shooter' ? (
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '450px', 
            backgroundColor: '#020617', 
            borderRadius: '30px', 
            overflow: 'hidden', 
            border: '5px solid #1e293b', 
            marginBottom: '20px', 
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)' 
          }}>
             {testEnded ? (
               <div style={{ color: 'white', paddingTop: '180px' }}>
                 <h2 style={{ fontSize: '40px', letterSpacing: '2px' }}>OYUN BİTDİ! 💥</h2>
                 <p style={{ fontSize: '24px' }}>Toplam Xal: {score}</p>
                 <button onClick={resetTest} style={{ marginTop: '20px', padding: '15px 40px', borderRadius: '12px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>YENİDƏN DÖYÜŞ</button>
               </div>
             ) : (
               enemies.map(en => (
                 <div key={en.id} style={{ 
                    position: 'absolute', 
                    top: en.y + '%', 
                    left: en.x + '%', 
                    background: '#fff', 
                    color: '#020617', 
                    padding: '10px 20px', 
                    borderRadius: '15px', 
                    fontWeight: 900, 
                    boxShadow: '0 0 25px rgba(59, 130, 246, 0.8)', 
                    transition: 'top 0.1s linear',
                    fontSize: '18px'
                  }}>
                   {en.word}
                 </div>
               ))
             )}
          </div>
        ) : (
          <div ref={scrollRef} style={{ 
            background: theme.card, 
            padding: '40px', 
            borderRadius: '30px', 
            border: `3px solid ${theme.border}`, 
            marginBottom: '30px', 
            fontSize: '32px', 
            textAlign: 'left', 
            height: '160px', 
            overflow: 'hidden', 
            lineHeight: '1.8' 
          }}>
            <div style={{ color: darkMode ? '#475569' : '#cbd5e0' }}>
              {wordList.join(' ').split('').map((char, index) => {
                let color = darkMode ? '#475569' : '#cbd5e0';
                let isCurrent = index === userInput.length;
                if (index < userInput.length) color = userInput[index] === char ? '#10b981' : '#ef4444';
                return <span key={index} className={isCurrent ? 'active-char' : ''} style={{ 
                  color, 
                  backgroundColor: isCurrent ? '#3b82f644' : 'transparent', 
                  borderBottom: isCurrent ? '5px solid #3b82f6' : 'none',
                  padding: '0 2px'
                }}>{char}</span>;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Giriş Sahəsi */}
      <input
        type="text"
        style={{ 
          width: '100%', 
          padding: '25px', 
          fontSize: '26px', 
          borderRadius: '20px', 
          border: '4px solid #3b82f6', 
          outline: 'none', 
          backgroundColor: theme.input, 
          color: theme.text, 
          boxShadow: '0 15px 30px -5px rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}
        value={userInput}
        onChange={handleInput}
        disabled={testEnded}
        placeholder={appMode === 'shooter' ? "SÖZÜ YAZ VƏ VUR! 💥" : "Yazmağa başla..."}
        autoFocus
      />

      {/* Statistikalar */}
      <div style={{ marginTop: '40px', fontSize: '24px', display: 'flex', justifyContent: 'space-around', fontWeight: 800 }}>
        <div>⏱️ {timeLeft}s</div>
        {appMode === 'shooter' ? <div>🎯 {score}</div> : (
          <>
            <div style={{ color: '#10b981' }}>✅ {correct}</div>
            <div style={{ color: '#3b82f6' }}>📈 {accuracy}%</div>
          </>
        )}
      </div>

      {/* Nəticə Ekranı */}
      {testEnded && appMode !== 'shooter' && (
        <div style={{ marginTop: '40px', padding: '50px', background: theme.card, borderRadius: '35px', border: '4px solid #3b82f6', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#3b82f6', marginBottom: '25px', fontSize: '32px' }}>MƏŞQ BİTDİ ✨</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', textAlign: 'left', maxWidth: '400px', margin: '0 auto 40px auto', fontSize: '20px' }}>
            <span>Sürət (WPM):</span> <b>{correct}</b>
            <span>Dəqiqlik:</span> <b>{accuracy}%</b>
            <span>Səviyyə:</span> <b style={{ color: '#3b82f6' }}>{correct > 50 ? 'Əfsanəvi 👑' : 'Yaxşı 🚀'}</b>
          </div>
          <button onClick={resetTest} style={{ padding: '20px 70px', cursor: 'pointer', borderRadius: '20px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 800, fontSize: '22px' }}>YENİDƏN BAŞLA</button>
        </div>
      )}
    </div>
  )
}
