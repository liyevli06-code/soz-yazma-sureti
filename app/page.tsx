'use client'
import React, { useState, useEffect, useRef } from 'react'

const WORDS = ["kitab", "universitet", "düşüncə", "fəaliyyət", "kompüter", "proqramlaşdırma", "internet", "sürət", "klaviatura", "Azərbaycan", "texnologiya", "məktəb", "ekran", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "gələcək", "elm", "həyat", "tələbə", "müəllim", "vaxt", "saniyə"];

export default function TypingApp() {
  const [mode, setMode] = useState<'test' | 'shooter'>('test');
  const [userInput, setUserInput] = useState('');
  const [testWords, setTestWords] = useState<string[]>([]);
  const [enemies, setEnemies] = useState<{ id: number; word: string; y: number; x: number }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Test rejimi üçün sözləri qarışdır
  useEffect(() => {
    setTestWords([...WORDS].sort(() => Math.random() - 0.5));
  }, []);

  // Yazma Testi üçün sürüşmə effekti
  useEffect(() => {
    if (mode === 'test' && scrollRef.current) {
      const activeChar = scrollRef.current.querySelector('.active-char') as HTMLElement;
      if (activeChar) {
        scrollRef.current.scrollTop = activeChar.offsetTop - 40;
      }
    }
  }, [userInput, mode]);

  // Qırıcı Oyunu və Taymer Logikası
  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }

    let gameInterval: any;
    let spawnInterval: any;
    if (mode === 'shooter' && isActive && !gameOver) {
      gameInterval = setInterval(() => {
        setEnemies(prev => {
          const moved = prev.map(e => ({ ...e, y: e.y + 1.5 }));
          if (moved.some(e => e.y > 90)) setGameOver(true);
          return moved;
        });
      }, 100);

      spawnInterval = setInterval(() => {
        setEnemies(prev => [...prev, {
          id: Date.now(),
          word: WORDS[Math.floor(Math.random() * WORDS.length)],
          x: Math.random() * 70 + 10,
          y: 0
        }]);
      }, 2000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(gameInterval);
      clearInterval(spawnInterval);
    };
  }, [isActive, timeLeft, mode, gameOver]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive) setIsActive(true);
    const val = e.target.value;
    setUserInput(val);

    if (mode === 'shooter') {
      const hit = enemies.find(en => en.word === val.trim());
