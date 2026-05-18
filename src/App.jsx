
import { useEffect, useRef, useState } from "react";
import { Url } from "./assets/Constants";
import History from "./Components/History";
import Chatlist from "./Components/Chatlist";
import ThemeToggle, { themes } from "./Themetoggle"; // ← themes bhi yahan se aa raha hai
import InputBar from "./Inputbar";

export default function App() {
  const [question, askquestion] = useState("");
  const [text, showtext] = useState([]);
  const [history, sethistory] = useState(JSON.parse(localStorage.getItem("history")) || []);
  const [selecthistory, setselecthistory] = useState("");
  const scrollref = useRef();
  const [loading, setloading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const t = themes[theme];

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  // Voice 
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported. Please use Chrome."); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    recognitionRef.current = rec;
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.onresult = (e) => {
      let tr = "";
      for (let i = 0; i < e.results.length; i++) tr += e.results[i][0].transcript;
      askquestion(tr);
    };
    rec.start();
  };

  // ── Ask

  const handlequestion = async (imageData = null, imageMime = null) => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
    if (!question && !selecthistory && !imageData) return;
    setloading(true);

    if (question) {
      const h = JSON.parse(localStorage.getItem("history") || "[]");
      const updated = [question, ...h];
      localStorage.setItem("history", JSON.stringify(updated));
      sethistory(updated);
    }

    const payloaddata = question || selecthistory;


    //Build parts array (text + optional image) 
    const parts = [];
    if (payloaddata) parts.push({ text: payloaddata });
    if (imageData && imageMime) {
      parts.push({ inline_data: { mime_type: imageMime, data: imageData } });
    }

    let data = await fetch(Url, {
      method: "POST",
      body: JSON.stringify({ contents: [{ parts }] }),
    });
    data = await data.json();
    if (!data.candidates) { alert("API limit reached or error"); setloading(false); return; }

    let ds = data.candidates[0].content.parts[0].text;
    ds = ds.replace(/###/g, "").split("* ").map((i) => i.replace(/\//g, "").trim());

    showtext((prev) => [
      ...prev,
      {
        type: "q",
        text: payloaddata,
        image: imageData ? `data:${imageMime};base64,${imageData}` : null, // show preview in chat
      },
      { type: "a", text: ds },
    ]);
    askquestion("");
    setloading(false);
    setTimeout(() => {
      if (scrollref.current) scrollref.current.scrollTop = scrollref.current.scrollHeight;
    }, 500);
  };

  useEffect(() => { if (selecthistory) handlequestion(); }, [selecthistory]);

  return (
    <div className={`flex h-screen ${t.bg} ${t.text} font-sans overflow-hidden transition-colors duration-300`}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed md:relative z-30 h-full w-65 ${t.sidebar} flex flex-col
        transition-transform duration-300 ease-in-out border-r ${t.border}
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* Logo + theme toggle */}
        <div className="flex items-center justify-between px-4 py-4">
          {/* ✅ ThemeToggle component use ho raha hai */}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} t={t} />
        </div>

        {/* New Chat */}
        <div className="px-3 mb-4">
          <button
            onClick={() => { showtext([]); askquestion(""); setSidebarOpen(false); }}
            className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-full ${t.newChatBtn} text-sm ${t.text} transition-colors border ${t.border}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-2">
          <p className={`text-xs ${t.textMuted} px-3 py-1 font-medium uppercase tracking-wider`}>Recent</p>
          <History
            setselecthistory={(h) => { setselecthistory(h); setSidebarOpen(false); }}
            history={history}
            sethistory={sethistory}
            theme={t}
          />

        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Mobile topbar */}

        <div className={`flex items-center justify-between px-4 py-3 md:hidden border-b ${t.border}`}>
          <button onClick={() => setSidebarOpen(true)} className={`${t.textMuted} transition-colors`}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          {/* Gemini naam - sirf mobile pe dikhega */}
          <span className="text-base font-medium bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent md:hidden">
            Gemini
          </span>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} t={t} />
        </div>

        {/* ✅ Desktop Header - sirf laptop/desktop pe */}
        <div className={`hidden md:flex items-center px-6 py-4 border-b ${t.border}`}>
          <span className="text-lg font-semibold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Gemini
          </span>
        </div>
        {/* Chat area */}
        <div ref={scrollref} className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
          {text.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl md:text-5xl font-semibold mb-3">
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Hello, User
                </span>
              </div>
              <p className={`${t.textMuted} text-lg`}>How can I help you today?</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full">
              <Chatlist text={text} theme={t} />
            </div>
          )}

          {loading && (
            <div className="max-w-3xl mx-auto mt-4 flex items-center gap-1 px-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className={`text-xs ${t.textFaint} ml-2`}>Generating...</span>
            </div>
          )}
        </div>

        {/* ✅ InputBar */}
        <InputBar
          question={question}
          askquestion={askquestion}
          loading={loading}
          isListening={isListening}
          startVoice={startVoice}
          handlequestion={handlequestion}
          theme={theme}
          t={t}
        />
      </main>
    </div>
  );
}
