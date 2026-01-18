'use client'

import React from "react"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const AZERBAIJANI_TEXTS = [
  "Azərbaycan dilində söz yazma sürətini ölçün. Bu tətbiq sizə 1 dəqiqə ərzində neçə söz yaza biləcəyinizi göstərəcəkdir. Başlamaq üçün aşağıdakı düymələrdən birini seçin.",
  "Kompüter texnologiyası əsr ərzində böyük dəyişikliklərə məruz qalmışdır. İlk elektron kompüterlərdən bu gün istifadə etdiyimiz qurğulara qədər, texnologiya insanların həyatını kökündən dəyişib.",
  "Milli dil millətə məxsus ən qiymətli bir xəzinədir. Azərbaycan dili varlığında aydın izlər qoymaq istəyən hər birinin üzərinə məsuliyyət düşür.",
  "Müəllimlər gələcəyi tikilən müəmminin yığılmış daşlarıdır. Onlar tələbələrə nəinki bilik verir, həm də onların şəxsiyyətini formalaşdırırlar.",
  "Sənətkarlıq bir elm, bir fəlsəfə və bir fənndir. Sənətkar öz əsərində ruhu, duyğularını və xəyalını yatırır."
]

export default function TypingSpeedTest() {
  const [currentText, setCurrentText] = useState(AZERBAIJANI_TEXTS[0])
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [testEnded, setTestEnded] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      handleTestEnd()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const calculateStats = (input: string) => {
    const words = input.trim().split(/\s+/).length
    const chars = input.length
    const correctChars = input.split('').filter((char, idx) => char === currentText[idx]).length
    
    const elapsedSeconds = 60 - timeLeft
    const minutes = elapsedSeconds / 60
    
    const currentWpm = Math.round(words / minutes)
    const currentAccuracy = Math.round((correctChars / chars) * 100) || 100

    setWpm(currentWpm)
    setAccuracy(Math.max(0, currentAccuracy))
  }

  const handleStart = () => {
    const randomText = AZERBAIJANI_TEXTS[Math.floor(Math.random() * AZERBAIJANI_TEXTS.length)]
    setCurrentText(randomText)
    setUserInput('')
    setTimeLeft(60)
    setIsActive(true)
    setTestEnded(false)
    setWpm(0)
    setAccuracy(100)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleTestEnd = () => {
    setIsActive(false)
    setTestEnded(true)
    calculateStats(userInput)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value
    setUserInput(input)
    if (isActive) {
      calculateStats(input)
    }
  }

  const handleReset = () => {
    setUserInput('')
    setTimeLeft(60)
    setIsActive(false)
    setTestEnded(false)
    setWpm(0)
    setAccuracy(100)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              Söz Yazma Sürəti
            </h1>
            <p className="text-slate-300">Azərbaycanca söz yazma sürətinizi ölçün</p>
          </div>

          {/* Timer */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-1 shadow-lg">
              <div className="bg-slate-800 rounded px-8 py-4">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {timeLeft}
                </span>
                <p className="text-slate-400 text-sm mt-1">saniyə</p>
              </div>
            </div>
          </div>

          {/* Text to Type */}
          <div className="mb-8 p-6 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-wrap break-words">
              {currentText.split('').map((char, idx) => {
                let color = 'text-slate-300'
                if (idx < userInput.length) {
                  color = userInput[idx] === char ? 'text-green-400' : 'text-red-400'
                }
                return (
                  <span key={idx} className={color}>
                    {char}
                  </span>
                )
              })}
            </p>
          </div>

          {/* Input Area */}
          <div className="mb-8">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              disabled={!isActive && !testEnded}
              placeholder="Mətni burada yazın..."
              className="w-full p-4 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 resize-none h-32"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
              <p className="text-slate-400 text-sm mb-1">Söz/Dəqiqə (WPM)</p>
              <p className="text-3xl font-bold text-purple-400">{wpm}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
              <p className="text-slate-400 text-sm mb-1">Düzgünlük (%)</p>
              <p className={`text-3xl font-bold ${accuracy >= 80 ? 'text-green-400' : accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {accuracy}%
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            {!isActive && !testEnded && (
              <Button
                onClick={handleStart}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-2 rounded-lg transition-all transform hover:scale-105"
              >
                Başla
              </Button>
            )}
            {testEnded && (
              <>
                <Button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-2 rounded-lg transition-all transform hover:scale-105"
                >
                  Yenidən Başla
                </Button>
                <Button
                  onClick={handleReset}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-8 py-2 rounded-lg transition-all"
                >
                  Təmizlə
                </Button>
              </>
            )}
          </div>

          {/* Test Ended Message */}
          {testEnded && (
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 text-center">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Test Tamamlandı!</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-slate-400 mb-1">Sözlərin Sayı</p>
                  <p className="text-2xl font-bold text-white">{userInput.trim().split(/\s+/).length}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Orta WPM</p>
                  <p className="text-2xl font-bold text-purple-400">{wpm}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Düzgünlük</p>
                  <p className="text-2xl font-bold text-pink-400">{accuracy}%</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
