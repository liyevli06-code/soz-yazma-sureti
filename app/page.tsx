'use client'
import React, { useState, useEffect, useRef } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";

// Sənin Firebase məlumatların
const firebaseConfig = {
  apiKey: "AIzaSyBKWfGbarGZxK6a3Qi9F7JZ2kvfosj9_Rc",
  authDomain: "soz-oyunu-e73ee.firebaseapp.com",
  projectId: "soz-oyunu-e73ee",
  storageBucket: "soz-oyunu-e73ee.firebasestorage.app",
  messagingSenderId: "376165752214",
  appId: "1:376165752214:web:291a3a6e95e9011b3291b7",
  measurementId: "G-G5GRXJ0DVZ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const EASY_WORDS = ["kitab", "universitet", "düşüncə", "fəaliyyət", "sayt", "server", "imtahan", "kompüter", "internet", "sürət", "klaviatura", "Azərbaycan", "məktəb", "ekran", "kod", "tətbiq", "uğur", "hədəf", "bilgi", "dünya", "elm", "həyat", "tələbə", "müəllim", "vaxt", "şəhər", "bilik", "vətən", "səma", "dəniz", "günəş", "insan", "dost", "hərf", "cümlə", "mətn"];
const HARD_WORDS = ["müvəffəqiyyətsizliklərimizdən", "elektroenergetika", "proqramlaşdırılma", "təkmilləşdirilməyən", "istiqamətləndiricilər", "fərdiləşdirilməmiş", "beynəlxalqlaşdırılma", "məsuliyyətsizlik"];

export default function GlobalTypingApp() {
  const [appMode, setAppMode] = useState<'easy' | 'hard' | 'shooter' | 'online'>('easy');
  const [userInput, setUserInput] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [testEnded, setTestEnded] = useState(false
