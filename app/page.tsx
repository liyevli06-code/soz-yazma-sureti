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
  
  const [enemies, setEnemies] = useState<{ id: number, word: string, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Audio obyekti (browser dəstəyi üçün useRef ilə)
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      audio.volume = 0.2;
      audio.play();
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
          const updated = prev.map(e => ({ ...e, y: e.y + 1.5 }));
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
          x: Math.random() * 80 + 5,
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
  
  // Dəqiqlik hesablanması
  const accuracy = userInput.length > 0 ? Math.round((correct / (correct + wrong || 1)) * 100) : 100;

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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#f7fafc', minHeight: '100vh', borderRadius: '20px' }}>
      <h1 style={{ color: '#2d3748', marginBottom: '10px' }}>Azərbaycanca Yazma Dünyası 🚀</h1>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)} 
          style={{ padding: '5px 15px', borderRadius: '20px', border: '1px solid #cbd5e0', cursor: 'pointer', background: soundEnabled ? '#e2e8f0' : '#fff' }}>
          {soundEnabled ? "🔊 Səs Açıq" : "🔇 Səs Bağlı"}
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setAppMode('easy')} style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'easy' ? '#48bb78' : '#edf2f7', color: appMode === 'easy' ? 'white' : 'black', fontWeight: 'bold' }}>Asan</button>
        <button onClick={() => setAppMode('hard')} style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'hard' ? '#f56565' : '#edf2f7', color: appMode === 'hard' ? 'white' : 'black', fontWeight: 'bold' }}>Çətin</button>
        <button onClick={() => setAppMode('code')} style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'code' ? '#805ad5' : '#edf2f7', color: appMode === 'code' ? 'white' : 'black', fontWeight: 'bold' }}>Kod Yazma 💻</button>
        <button onClick={() => setAppMode('shooter')} style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'shooter' ? '#3182ce' : '#edf2f7', color: appMode === 'shooter' ? 'white' : 'black', fontWeight: 'bold' }}>Qırıcı Oyunu 🚀</button>
      </div>
      
      {/* Progress Bar (Gedişat çubuğu) */}
      {isActive && appMode !== 'shooter' && (
        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '15px', overflow: 'hidden' }}>
          <div style={{ width: `${(timeLeft / 60) * 100}%`, height: '100%', background: '#3182ce', transition: 'width 1s linear' }}></div>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {appMode === 'shooter' ? (
          <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#1a202c', borderRadius: '15px', overflow: 'hidden', border: '4px solid #2d3748', marginBottom: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)' }}>
             {testEnded ? (
               <div style={{ color: 'white', paddingTop: '150px' }}><h2>OYUN BİTDİ! ❌</h2><p>Xal: {score}</p></div>
             ) : (
               enemies.map(en => (
                 <div key={en.id} style={{ position: 'absolute', top: en.y + '%', left: en.x + '%', background: 'white', padding: '5px 12px', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'top 0.1s linear' }}>
                   {en.word}
                 </div>
               ))
             )}
          </div>
        ) : (
          <div ref={scrollRef} style={{ background: '#fff', padding: '25px', borderRadius: '15px', border: '2px solid #e2e8f0', marginBottom: '20px', fontSize: '26px', textAlign: 'left', height: '120px', overflow: 'hidden', lineHeight: '1.6', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#cbd5e0' }}>
              {wordList.join(' ').split('').map((char, index) => {
                let color = '#cbd5e0';
                let isCurrent = index === userInput.length;
                if (index < userInput.length) {
                  color = userInput[index] === char ? '#38a169' : '#e53e3e';
                }
                return <span key={index} className={isCurrent ? 'active-char' : ''} style={{ color, backgroundColor: isCurrent ? '#ebf8ff' : 'transparent', borderBottom: isCurrent ? '3px solid #3182ce' : 'none', padding: '0 1px' }}>{char}</span>;
              })}
            </div>
          </div>
        )}
      </div>

      <input
        type="text"
        style={{ width: '100%', padding: '18px', fontSize: '20px', borderRadius: '12px', border: '2px solid #3182ce', outline: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s' }}
        value={userInput}
        onChange={handleInput}
        disabled={testEnded}
        placeholder={appMode === 'shooter' ? "Sözü bura yazıb düşməni vurun!" : "Yazmağa başlayın..."}
        autoFocus
      />

      <div style={{ marginTop: '20px', fontSize: '22px', display: 'flex', justifyContent: 'space-around', color: '#4a5568' }}>
        <div>Vaxt: <b style={{ color: timeLeft < 10 ? '#e53e3e' : '#2d3748' }}>{timeLeft}s</b></div>
        {appMode === 'shooter' ? <div>Xal: <b>{score}</b></div> : (
          <>
            <div>Düz: <b style={{ color: '#38a169' }}>{correct}</b></div>
            <div>Dəqiqlik: <b style={{ color: '#3182ce' }}>{accuracy}%</b></div>
          </>
        )}
      </div>

      {testEnded && (
        <div style={{ marginTop: '25px', padding: '30px', background: 'white', borderRadius: '15px', border: '2px solid #3182ce', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#2b6cb0', marginBottom: '15px' }}>Nəticə Hesabatı ✨</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            <span>Sürət:</span> <b>{appMode === 'shooter' ? `${score} Xal` : `${correct} WPM`}</b>
            <span>Səhv Sayı:</span> <b style={{ color: '#e53e3e' }}>{wrong}</b>
            <span>Dəqiqlik:</span> <b>{accuracy}%</b>
            <span>Səviyyə:</span> <b style={{ color: '#3182ce' }}>{getStatus()}</b>
          </div>
          <button onClick={resetTest} style={{ padding: '14px 40px', cursor: 'pointer', borderRadius: '10px', border: 'none', background: '#3182ce', color: 'white', fontWeight: 'bold', fontSize: '18px', transition: 'transform 0.2s' }}>Yenidən Başla</button>
        </div>
      )}
    </div>
  )
}
