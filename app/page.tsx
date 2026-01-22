'use client'
import React, { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";

// Sənin Firebase məlumatların
const firebaseConfig = {
  apiKey: "AIzaSyBKWfGbarGZxK6a3Qi9F7JZ2kvfosj9_Rc",
  authDomain: "soz-oyunu-e73ee.firebaseapp.com",
  databaseURL: "https://soz-oyunu-e73ee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "soz-oyunu-e73ee",
  storageBucket: "soz-oyunu-e73ee.firebasestorage.app",
  messagingSenderId: "376165752214",
  appId: "1:376165752214:web:291a3a6e95e9011b3291b7",
  measurementId: "G-G5GRXJ0DVZ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const WORDS = ["kitab", "universitet", "düşüncə", "fəaliyyət", "sayt", "server", "imtahan", "kompüter", "internet", "sürət", "Azərbaycan", "ekran", "kod", "tətbiq", "uğur", "hədəf", "elm", "vaxt", "şəhər", "bilik", "insan", "dost", "cümlə", "mətn"];

export default function GlobalTypingApp() {
  const [appMode, setAppMode] = useState<'easy' | 'online'>('easy');
  const [userInput, setUserInput] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);
  const [playerRole, setPlayerRole] = useState<'p1' | 'p2' | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [testEnded, setTestEnded] = useState(false);

  useEffect(() => {
    if (appMode === 'easy') {
      setWordList([...WORDS].sort(() => Math.random() - 0.5));
    }
  }, [appMode]);

  useEffect(() => {
    if (appMode === 'online') {
      const roomRef = ref(db, `rooms/global_room`);
      return onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGameState(data);
          if (data.p1_hp <= 0 || data.p2_hp <= 0) setTestEnded(true);
        }
      });
    }
  }, [appMode]);

  const joinOnline = (role: 'p1' | 'p2') => {
    setPlayerRole(role);
    update(ref(db, `rooms/global_room`), {
      [`${role}_hp`]: 100,
      [`${role}_target`]: WORDS[Math.floor(Math.random() * WORDS.length)]
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);

    if (appMode === 'online' && playerRole && !testEnded) {
      const target = playerRole === 'p1' ? gameState?.p1_target : gameState?.p2_target;
      if (val.trim() === target) {
        const enemy = playerRole === 'p1' ? 'p2' : 'p1';
        update(ref(db, `rooms/global_room`), {
          [`${enemy}_hp`]: Math.max(0, (gameState[`${enemy}_hp`] || 100) - 10),
          [`${playerRole}_target`]: WORDS[Math.floor(Math.random() * WORDS.length)]
        });
        setUserInput('');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Yazma Dünyası 🚀</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => {setAppMode('easy'); setPlayerRole(null);}} style={{ padding: '10px', marginRight: '10px', background: appMode === 'easy' ? '#48bb78' : '#edf2f7' }}>Tək Nəfərlik</button>
        <button onClick={() => setAppMode('online')} style={{ padding: '10px', background: appMode === 'online' ? '#805ad5' : '#edf2f7', color: appMode === 'online' ? 'white' : 'black' }}>Onlayn PvP ⚔️</button>
      </div>

      {appMode === 'online' ? (
        !playerRole ? (
          <div style={{ padding: '30px', background: '#f7fafc', borderRadius: '15px' }}>
            <button onClick={() => joinOnline('p1')} style={{ padding: '15px', margin: '5px', background: '#3182ce', color: 'white' }}>Oyunçu 1 Ol</button>
            <button onClick={() => joinOnline('p2')} style={{ padding: '15px', margin: '5px', background: '#e53e3e', color: 'white' }}>Oyunçu 2 Ol</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1, padding: '15px', border: '2px solid #3182ce', borderRadius: '10px' }}>
              <h3>P1 Can: {gameState?.p1_hp}%</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{gameState?.p1_target}</div>
            </div>
            <div style={{ flex: 1, padding: '15px', border: '2px solid #e53e3e', borderRadius: '10px' }}>
              <h3>P2 Can: {gameState?.p2_hp}%</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{gameState?.p2_target}</div>
            </div>
          </div>
        )
      ) : (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '20px', fontSize: '22px', height: '80px', overflow: 'hidden' }}>
          {wordList.join(' ').split('').map((char, index) => (
            <span key={index} style={{ color: index < userInput.length ? (userInput[index] === char ? '#38a169' : '#e53e3e') : '#cbd5e0' }}>{char}</span>
          ))}
        </div>
      )}

      <input
        type="text"
        style={{ width: '100%', padding: '12px', fontSize: '18px', borderRadius: '8px', border: '2px solid #3182ce' }}
        value={userInput}
        onChange={handleInput}
        placeholder="Yazmağa başlayın..."
        disabled={testEnded}
      />

      {testEnded && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f0f9ff', borderRadius: '10px' }}>
          <h2>Oyun Bitdi! 🏁</h2>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#3182ce', color: 'white', cursor: 'pointer' }}>Yenidən Başla</button>
        </div>
      )}
    </div>
  );
}
