'use client'
import React, { useState, useEffect, useRef } from 'react'

const EASY_WORDS = ["kitab", "universitet", "düşüncə", "fəaliyyət", "sayt", "server", "imtahan", "kompüter", "proqramlaşdırma", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "öyrənmək", "ekran", "siçan", "kod", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "gələcək", "elm", "məqsəd", "həyat", "tələbə", "müəllim", "vaxt", "saniyə", "dəqiqə", "klaviş", "məkan", "zaman", "şəhər", "qələm", "dəftər", "bilik", "sevgi", "vətən", "bayraq", "səma", "dəniz", "yağış", "günəş", "bulud", "bahar", "çiçək", "meyvə", "səhər", "axşam", "gecə", "insan", "ailə", "dost", "yoldaş", "hərf", "cümlə", "mətn", "səhifə", "kitabxana", "lüğət", "mədəniyyət", "iqtisadiyyat", "ədəbiyyat", "riyaziyyat", "müstəqillik", "demokratiya", "respublika", "təhlükəsizlik", "əməkdaşlıq", "yaradıcılıq", "təşəbbüs", "müasirlik", "gənclik", "təcrübə", "müvəffəqiyyət"];
const HARD_WORDS = ["müvəffəqiyyətsizliklərimizdən", "elektroenergetika", "proqramlaşdırılma", "təkmilləşdirilməyən", "istiqamətləndiricilər", "fərdiləşdirilməmiş", "beynəlxalqlaşdırılma", "məsuliyyətsizlik", "xarakterizəolunma", "mərkəzləşdirilməmiş", "sənayeləşdirilmə", "universitetlərarası", "mükəmməlləşdirilmə", "mütəşəkkilləşdirilmiş", "sabitləşdiricilər", "radioteleviziya", "hüquqşünaslıq", "elektromaqnit", "demokratikləşdirilmə", "avtomatlaşdırılma", "konseptuallaşdırma", "mikrobiologiya", "kristallaşdırılma", "transformasiya", "differensiallaşma", "mütəxəssisləşdirilmə", "standartlaşdırılma"];

export default function TypingApp() {
  const [appMode, setAppMode] = useState<'easy' | 'hard' | 'shooter' | 'pvp'>('easy');
  const [userInput, setUserInput] = useState('');
  const [userInputP2, setUserInputP2] = useState(''); // PvP üçün 2-ci oyunçu
  const [wordList, setWordList] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [testEnded, setTestEnded] = useState(false);

  // PvP üçün can və hədəf sözlər
  const [hpP1, setHpP1] = useState(100);
  const [hpP2, setHpP2] = useState(100);
  const [targetP1, setTargetP1] = useState('');
  const [targetP2, setTargetP2] = useState('');

  // Shooter rejimi üçün
  const [enemies, setEnemies] = useState<{ id: number, word: string, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetTest();
    if (appMode !== 'shooter' && appMode !== 'pvp') {
      const source = appMode === 'easy' ? EASY_WORDS : HARD_WORDS;
      setWordList([...source].sort(() => Math.random() - 0.5));
    } else if (appMode === 'pvp') {
      setTargetP1(EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)]);
      setTargetP2(EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)]);
    }
  }, [appMode]);

  const resetTest = () => {
    setUserInput(''); setUserInputP2(''); setTimeLeft(60);
    setIsActive(false); setTestEnded(false); setEnemies([]);
    setScore(0); setHpP1(100); setHpP2(100);
  };

  // Taymer
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0 && !testEnded) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false); setTestEnded(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, testEnded]);

  // PvP Atəş mexanikası
  const handleP1Input = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive) setIsActive(true);
    const val = e.target.value;
    setUserInput(val);
    if (val.trim() === targetP1) {
      setHpP2(prev => Math.max(0, prev - 10));
      setTargetP1(EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)]);
      setUserInput('');
      if (hpP2 <= 10) setTestEnded(true);
    }
  }

  const handleP2Input = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive) setIsActive(true);
    const val = e.target.value;
    setUserInputP2(val);
    if (val.trim() === targetP2) {
      setHpP1(prev => Math.max(0, prev - 10));
      setTargetP2(EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)]);
      setUserInputP2('');
      if (hpP1 <= 10) setTestEnded(true);
    }
  }

  // Shooter hərəkəti (digər rejimlər üçün eyni qalır)
  useEffect(() => {
    if (appMode === 'shooter' && isActive && !testEnded) {
      const move = setInterval(() => {
        setEnemies(prev => {
          const updated = prev.map(e => ({ ...e, y: e.y + 1.5 }));
          if (updated.some(e => e.y > 90)) { setTestEnded(true); setIsActive(false); }
          return updated;
        });
      }, 100);
      const spawn = setInterval(() => {
        setEnemies(prev => [...prev, { id: Date.now(), word: EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)], x: Math.random() * 80 + 5, y: 0 }]);
      }, 2000);
      return () => { clearInterval(move); clearInterval(spawn); };
    }
  }, [appMode, isActive, testEnded]);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Dünyası 🚀</h1>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setAppMode('easy')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'easy' ? '#48bb78' : '#edf2f7', color: appMode === 'easy' ? 'white' : 'black' }}>Asan</button>
        <button onClick={() => setAppMode('hard')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'hard' ? '#f56565' : '#edf2f7', color: appMode === 'hard' ? 'white' : 'black' }}>Çətin</button>
        <button onClick={() => setAppMode('shooter')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'shooter' ? '#3182ce' : '#edf2f7', color: appMode === 'shooter' ? 'white' : 'black' }}>Qırıcı</button>
        <button onClick={() => setAppMode('pvp')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: appMode === 'pvp' ? '#805ad5' : '#edf2f7', color: appMode === 'pvp' ? 'white' : 'black' }}>Duel (PvP) ⚔️</button>
      </div>

      {appMode === 'pvp' ? (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          {/* OYUNÇU 1 */}
          <div style={{ flex: 1, padding: '20px', background: '#f7fafc', borderRadius: '15px', border: '2px solid #3182ce' }}>
            <h3>Oyunçu 1 (Sol)</h3>
            <div style={{ background: '#edf2f7', height: '10px', borderRadius: '5px', marginBottom: '10px' }}>
              <div style={{ width: `${hpP1}%`, height: '100%', background: 'green', borderRadius: '5px', transition: '0.3s' }} />
            </div>
            <div style={{ fontSize: '24px', margin: '20px 0', minHeight: '40px', color: '#2d3748', fontWeight: 'bold' }}>{targetP1}</div>
            <input value={userInput} onChange={handleP1Input} disabled={testEnded} placeholder="Sözü yaz!" style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }} />
          </div>

          <div style={{ alignSelf: 'center', fontSize: '30px' }}>VS</div>

          {/* OYUNÇU 2 */}
          <div style={{ flex: 1, padding: '20px', background: '#fff5f5', borderRadius: '15px', border: '2px solid #e53e3e' }}>
            <h3>Oyunçu 2 (Sağ)</h3>
            <div style={{ background: '#edf2f7', height: '10px', borderRadius: '5px', marginBottom: '10px' }}>
              <div style={{ width: `${hpP2}%`, height: '100%', background: 'green', borderRadius: '5px', transition: '0.3s' }} />
            </div>
            <div style={{ fontSize: '24px', margin: '20px 0', minHeight: '40px', color: '#2d3748', fontWeight: 'bold' }}>{targetP2}</div>
            <input value={userInputP2} onChange={handleP2Input} disabled={testEnded} placeholder="Sözü yaz!" style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }} />
          </div>
        </div>
      ) : (
        /* ... Köhnə Rejimlər Bura daxildir ... */
        <div style={{ position: 'relative' }}>
          {appMode === 'shooter' ? (
            <div style={{ height: '400px', backgroundColor: '#1a202c', borderRadius: '15px', position: 'relative', overflow: 'hidden' }}>
              {enemies.map(en => <div key={en.id} style={{ position: 'absolute', top: en.y + '%', left: en.x + '%', background: 'white', padding: '5px 12px', borderRadius: '8px', fontWeight: 'bold' }}>{en.word}</div>)}
            </div>
          ) : (
            <div ref={scrollRef} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0', height: '100px', overflow: 'hidden', textAlign: 'left', fontSize: '24px' }}>
              {wordList.join(' ').split('').map((char, index) => <span key={index} style={{ color: index < userInput.length ? (userInput[index] === char ? '#38a169' : '#e53e3e') : '#cbd5e0' }}>{char}</span>)}
            </div>
          )}
          <input value={userInput} onChange={(e) => { if (!isActive) setIsActive(true); setUserInput(e.target.value); if (appMode === 'shooter') { const hit = enemies.find(en => en.word === e.target.value.trim()); if (hit) { setEnemies(p => p.filter(x => x.id !== hit.id)); setScore(s => s + 10); setUserInput(''); } } }} disabled={testEnded} style={{ width: '100%', padding: '15px', marginTop: '20px', fontSize: '18px', borderRadius: '10px', border: '2px solid #3182ce' }} placeholder="Yazmağa başlayın..." autoFocus />
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '18px' }}>Vaxt: {timeLeft}s</div>

      {testEnded && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f0f9ff', borderRadius: '10px' }}>
          <h2>{appMode === 'pvp' ? (hpP1 > hpP2 ? "Qalib: Oyunçu 1! 🏆" : "Qalib: Oyunçu 2! 🏆") : "Oyun Bitdi!"}</h2>
          <button onClick={resetTest} style={{ padding: '10px 20px', cursor: 'pointer', background: '#3182ce', color: 'white', border: 'none', borderRadius: '5px' }}>Yenidən Başla</button>
        </div>
      )}
    </div>
  );
}
