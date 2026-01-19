'use client'
import React, { useState, useEffect, useRef } from 'react'

const EASY_WORDS = ["kitab", "universitet", "düşüncə", "fəaliyyət", "sayt", "server", "imtahan", "kompüter", "proqramlaşdırma", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "öyrənmək", "ekran", "siçan", "kod", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "gələcək", "elm", "məqsəd", "həyat", "tələbə", "müəllim", "vaxt", "saniyə", "dəqiqə", "klaviş", "məkan", "zaman", "şəhər", "qələm", "dəftər", "bilik", "sevgi", "vətən", "bayraq", "səma", "dəniz", "yağış", "günəş", "bulud", "bahar", "çiçək", "meyvə", "səhər", "axşam", "gecə", "insan", "ailə", "dost", "yoldaş", "hərf", "cümlə", "mətn", "səhifə", "kitabxana", "lüğət", "mədəniyyət", "iqtisadiyyat", "ədəbiyyat", "riyaziyyat", "müstəqillik", "demokratiya", "respublika", "təhlükəsizlik", "əməkdaşlıq", "yaradıcılıq", "təşəbbüs", "müasirlik", "gənclik", "təcrübə", "müvəffəqiyyət"];
const HARD_WORDS = ["müvəffəqiyyətsizliklərimizdən", "elektroenergetika", "proqramlaşdırılma", "təkmilləşdirilməyən", "istiqamətləndiricilər", "fərdiləşdirilməmiş", "beynəlxalqlaşdırılma", "məsuliyyətsizlik", "xarakterizəolunma", "mərkəzləşdirilməmiş", "sənayeləşdirilmə", "universitetlərarası", "mükəmməlləşdirilmə", "mütəşəkkilləşdirilmiş", "sabitləşdiricilər", "radioteleviziya", "hüquqşünaslıq", "elektromaqnit", "demokratikləşdirilmə", "avtomatlaşdırılma", "konseptuallaşdırma", "mikrobiologiya", "kristallaşdırılma", "transformasiya", "differensiallaşma", "mütəxəssisləşdirilmə", "standartlaşdırılma"];

export default function TypingTest() {
  const [mode, setMode] = useState<'easy' | 'hard'>('easy')
  const [userInput, setUserInput] = useState('')
  const [wordList, setWordList] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [testEnded, setTestEnded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const source = mode === 'easy' ? EASY_WORDS : HARD_WORDS;
    setWordList([...source].sort(() => Math.random() - 0.5));
    resetTest();
  }, [mode])

  const resetTest = () => {
    setUserInput('');
    setTimeLeft(60);
    setIsActive(false);
    setTestEnded(false);
  }

  useEffect(() => {
    if (scrollRef.current) {
      const activeChar = scrollRef.current.querySelector('.active-char') as HTMLElement;
      if (activeChar) {
        // Kursorun olduğu yerə görə qutunu sürüşdürür
        scrollRef.current.scrollTop = activeChar.offsetTop - 40;
      }
    }
  }, [userInput]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setTestEnded(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const userWords = userInput.trim().split(/\s+/);
  const correct = userWords.filter((w, i) => w === wordList[i]).length;
  const wrong = userWords.filter((w, i) => w !== "" && w !== wordList[i]).length;

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Azərbaycanca Yazma Testi</h2>

      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button onClick={() => setMode('easy')} style={{ padding: '8px 16px', borderRadius: '5px', border: 'none', cursor: 'pointer', backgroundColor: mode === 'easy' ? '#48bb78' : '#edf2f7', color: mode === 'easy' ? 'white' : 'black' }}>Asan Rejim</button>
        <button onClick={() => setMode('hard')} style={{ padding: '8px 16px', borderRadius: '5px', border: 'none', cursor: 'pointer', backgroundColor: mode === 'hard' ? '#f56565' : '#edf2f7', color: mode === 'hard' ? 'white' : 'black' }}>Çətin Rejim</button>
      </div>
      
      {/* 3 SƏTİRLİK MƏTN QUTUSU */}
      <div 
        ref={scrollRef}
        style={{ 
          background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0',
          marginBottom: '20px', fontSize: '24px', textAlign: 'left', 
          height: '100px', // Cəmi 3 sətir yerləşir
          overflow: 'hidden', // Artıq sözləri tam gizlədir
          lineHeight: '1.6', position: 'relative', display: 'block'
        }}
      >
        <div style={{ color: '#cbd5e0', transition: 'all 0.3s' }}>
          {wordList.join(' ').split('').map((char, index) => {
            let color = '#cbd5e0';
            let isCurrent = index === userInput.length;
            if (index < userInput.length) {
              color = userInput[index] === char ? '#38a169' : '#e53e3e';
            }
            return (
              <span key={index} className={isCurrent ? 'active-char' : ''} style={{ 
                color, 
                backgroundColor: isCurrent ? '#ebf8ff' : 'transparent',
                borderBottom: isCurrent ? '2px solid #3182ce' : 'none'
              }}>
                {char}
              </span>
            );
          })}
        </div>
      </div>

      <input
        type="text"
        style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '10px', border: '2px solid #3182ce', outline: 'none' }}
        value={userInput}
        onChange={(e) => {
          if (!isActive && !testEnded) setIsActive(true);
          setUserInput(e.target.value);
        }}
        disabled={testEnded}
        placeholder="Yazmağa başlayın..."
        autoFocus
      />

      <div style={{ marginTop: '15px', fontSize: '20px' }}>
        Vaxt: <b>{timeLeft}s</b> | Düz: <span style={{color:'green'}}>{correct}</span> | Səhv: <span style={{color:'red'}}>{wrong}</span>
      </div>

      {testEnded && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #3182ce' }}>
          <h3>Nəticə: {correct} wpm</h3>
          <button onClick={() => resetTest()} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', border: 'none', background: '#3182ce', color: 'white' }}>Yenidən Başla</button>
        </div>
      )}
    </div>
  )
}
