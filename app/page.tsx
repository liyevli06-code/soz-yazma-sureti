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
        <div style={{ marginTop: '20px', padding: '20px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #3182ce' }}>
          <h3>Nəticə: {appMode === 'shooter' ? `${score} Xal` : `${correct} wpm`}</h3>
          <button onClick={resetTest} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', border: 'none', background: '#3182ce', color: 'white' }}>Yenidən Başla</button>
        </div>
      )}
    </div>
  )
}
