'use client'
import React, { useState, useEffect, useRef } from 'react'

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
  const scrollRef = useRef<HTMLDivElement>(null)

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

  // Avtomatik aşağı sürüşmə funksiyası
  useEffect(() => {
    if (scrollRef.current) {
      const activeChar = scrollRef.current.querySelector('.active-char');
      if (activeChar) {
        activeChar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [userInput]);

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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h2 style={{ marginBottom: '20px' }}>Yazma Testi</h2>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button onClick={() => setMode('easy')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: mode === 'easy' ? '#48bb78' : '#edf2f7', color: mode === 'easy' ? 'white' : 'black' }}>Asan</button>
        <button onClick={() => setMode('hard')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: mode === 'hard' ? '#f56565' : '#edf2f7', color: mode === 'hard' ? 'white' : 'black' }}>Çətin</button>
      </div>
      
      {/* 3 SƏTİRLİK SABİT QUTU */}
      <div 
        ref={scrollRef}
        style={{ 
          background: '#fff', padding: '15px 25px', borderRadius: '12px', border: '2px solid #e2e8f0',
          marginBottom: '20px', fontSize: '24px', textAlign: 'left', 
          height: '110px', // Təxminən 3 sətir hündürlüyü
          overflow: 'hidden', // Artıq sözləri gizlədir
          lineHeight: '1.5', position: 'relative'
        }}
      >
        <div style={{ color: '#a0aec0' }}>
          {wordList.join(' ').split('').map
