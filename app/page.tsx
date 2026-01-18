'use client'
import React, { useState, useEffect } from 'react'

const AZERBAIJANI_TEXTS = [
  "Azərbaycan dilində söz yazma sürətini ölçün. Bu tətbiq sizə 1 dəqiqə ərzində neçə söz yaza biləcəyinizi göstərəcəkdir.",
  "Milli dil millətə məxsus ən qiymətli bir xəzinədir. Azərbaycan dili varlığında aydın izlər qoymaq hər bir kəsin məsuliyyətidir."
]

export default function TypingSpeedTest() {
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [testEnded, setTestEnded] = useState(false)

  useEffect(() => {
    let interval: any = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      setTestEnded(true)
      const words = userInput.trim().split(/\s+/).length
      setWpm(words)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, userInput])

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Söz Yazma Sürəti Ölçən</h1>
      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px', marginBottom: '20px', fontSize: '18px' }}>
        {AZERBAIJANI_TEXTS[0]}
      </div>
      <textarea
        style={{ width: '100%', height: '150px', padding: '15px', fontSize: '16px', borderRadius: '5px' }}
        value={userInput}
        onChange={(e) => {
          if (!isActive && !testEnded) setIsActive(true)
          setUserInput(e.target.value)
        }}
        disabled={testEnded}
        placeholder="Yazmağa başlayın..."
      />
      <h2 style={{ color: timeLeft < 10 ? 'red' : 'black' }}>Vaxt: {timeLeft} saniyə</h2>
      {testEnded && <h2 style={{ color: 'green' }}>Nəticə: {wpm} söz/dəqiqə</h2>}
      <button 
        onClick={() => window.location.reload()}
        style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Yenidən Başla
      </button>
    </div>
  )
}
