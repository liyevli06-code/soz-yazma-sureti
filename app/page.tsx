'use client'
import React, { useState, useEffect, useRef } from 'react'

const EASY_WORDS = ["kitab", "universitet", "düşüncə", "fəaliyyət", "sayt", "server", "imtahan", "kompüter", "proqramlaşdırma", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "öyrənmək", "ekran", "siçan", "kod", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "gələcək", "elm", "məqsəd", "həyat", "tələbə", "müəllim", "vaxt", "saniyə", "dəqiqə", "klaviş", "məkan", "zaman", "şəhər", "qələm", "dəftər", "bilik", "sevgi", "vətən", "bayraq", "səma", "dəniz", "yağış", "günəş", "bulud", "bahar", "çiçək", "meyvə", "səhər", "axşam", "gecə", "insan", "ailə", "dost", "yoldaş", "hərf", "cümlə", "mətn", "səhifə", "kitabxana", "lüğət", "mədəniyyət", "iqtisadiyyat", "ədəbiyyat", "riyaziyyat", "müstəqillik", "demokratiya", "respublika", "təhlükəsizlik", "əməkdaşlıq", "yaradıcılıq", "təşəbbüs", "müasirlik", "gənclik", "təcrübə", "müvəffəqiyyət"];
const HARD_WORDS = ["müvəffəqiyyətsizliklərimizdən", "elektroenergetika", "proqramlaşdırılma", "təkmilləşdirilməyən", "istiqamətləndiricilər", "fərdiləşdirilməmiş", "beynəlxalqlaşdırılma", "məsuliyyətsizlik", "xarakterizəolunma", "mərkəzləşdirilməmiş", "sənayeləşdirilmə", "universitetlərarası", "mükəmməlləşdirilmə", "mütəşəkkilləşdirilmiş", "sabitləşdiricilər", "radioteleviziya", "hüquqşünaslıq", "elektromaqnit", "demokratikləşdirilmə", "avtomatlaşdırılma", "konseptuallaşdırma", "mikrobiologiya", "kristallaşdırılma", "transformasiya", "differensiallaşma", "mütəxəssisləşdirilmə", "standartlaşdırılma"];

export default function TypingApp() {
  const [appMode, setAppMode] = useState<'easy' | 'hard' | 'shooter'>('easy');
  const [userInput, setUserInput] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  
  const [enemies, setEnemies] = useState<{ id: number, word: string, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetTest();
    if (appMode !== 'shooter') {
      const source = appMode === 'easy' ? EASY_WORDS : HARD_WORDS;
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

  // Səviyyəni təyin edən funksiya
  const getStatus = () => {
    if (appMode === 'shooter') {
      if (score <= 50) return "Piyada 🛡️";
      if (score <= 150) return "Snayper 🎯";
      if (score <= 300) return "Komandir 🎖️";
      return "Baş Komandan 👑";
    } else {
      if (correct <= 20) return "Başlanğıc 🐢";
      if (correct <= 40) return "Orta ⌨️";
      if (correct <= 60) return "Peşəkar 🚀";
      if (correct <= 80) return "Ekspert 🔥";
      return "Əfsanəvi 👑";
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Azərbaycanca Yazma Dünyası 🚀</h1>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setAppMode('easy')} style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'easy' ? '#48bb78' : '#edf2f7', color: appMode === 'easy' ? 'white' : 'black' }}>Asan Test</button>
        <button onClick={() => setAppMode('hard')} style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'hard' ? '#f56565' : '#edf2f7', color: appMode === 'hard' ? 'white' : 'black' }}>Çətin Test</button>
        <button onClick={() => setAppMode('shooter')} style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'shooter' ? '#3182ce' : '#edf2f7', color: appMode === 'shooter' ? 'white' : 'black' }}>Qırıcı Oyunu 🚀</button>
      </div>
      
      <div style={{ position: 'relative' }}>
        {appMode === 'shooter' ? (
          <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#1a202c', borderRadius: '15px', overflow: 'hidden', border: '3px solid #2d3748', marginBottom: '20px' }}>
             {testEnded ? (
               <div style={{ color: 'white', paddingTop: '150px' }}><h2>OYUN BİTDİ! ❌</h2><p>Xal: {score}</p></div>
             ) : (
               enemies.map(en => (
                 <div key={en.id} style={{ position: 'absolute', top: en.y + '%', left: en.x + '%', background: 'white', padding: '5px 12px', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                   {en.word}
                 </div>
               ))
             )}
          </div>
        ) : (
          <div ref={scrollRef} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '20px', fontSize: '24px', textAlign: 'left', height: '110px', overflow: 'hidden', lineHeight: '1.6' }}>
            <div style={{ color: '#cbd5e0' }}>
              {wordList.join(' ').split('').map((char, index) => {
                let color = '#cbd5e0';
                let isCurrent = index === userInput.length;
                if (index < userInput.length) {
                  color = userInput[index] === char ? '#38a169' : '#e53e3e';
                }
                return <span key={index} className={isCurrent ? 'active-char' : ''} style={{ color, backgroundColor: isCurrent ? '#ebf8ff' : 'transparent', borderBottom: isCurrent ? '2px solid #3182ce' : 'none' }}>{char}</span>;
              })}
            </div>
          </div>
        )}
      </div>

      <input
        type="text"
        style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '10px', border: '2px solid #3182ce', outline: 'none' }}
        value={userInput}
        onChange={handleInput}
        disabled={testEnded}
        placeholder={appMode === 'shooter' ? "Sözü yaz və vur!" : "Yazmağa başlayın..."}
        autoFocus
      />

      <div style={{ marginTop: '15px', fontSize: '20px' }}>
        Vaxt: <b>{timeLeft}s</b> | {appMode === 'shooter' ? `Xal: ${score}` : `Düz: ${correct} / Səhv: ${wrong}`}
      </div>

      {testEnded && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #3182ce', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#2b6cb0', margin: '0 0 10px 0' }}>Test Tamamlandı!</h2>
          <div style={{ fontSize: '22px', marginBottom: '10px' }}>
            {appMode === 'shooter' ? `Toplam Xal: ${score}` : `Sürət: ${correct} WPM`}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748', marginBottom: '20px' }}>
            Səviyyəniz: <span style={{ color: '#3182ce' }}>{getStatus()}</span>
          </div>
          <button onClick={resetTest} style={{ padding: '12px 25px', cursor: 'pointer', borderRadius: '8px', border: 'none', background: '#3182ce', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Yenidən Başla</button>
        </div>
      )}
    </div>
  )
}
