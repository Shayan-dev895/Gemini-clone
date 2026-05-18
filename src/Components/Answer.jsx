import { useEffect, useRef, useState } from "react";


function useTyping(fullText, enabled) {
  const [displayed, setDisplayed] = useState(enabled ? "" : fullText);
  const idx = useRef(0);

  useEffect(() => {
    if (!enabled) { setDisplayed(fullText); return; }
    idx.current = 0;
    setDisplayed("");
    const id = setInterval(() => {
      idx.current += 1;
      setDisplayed(fullText.slice(0, idx.current));
      if (idx.current >= fullText.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [fullText]);

  return displayed;
}

// Copy button
function CopyBtn({ text, theme: t }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={copy}
      title="Copy"
      className={`ml-1 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150
        ${copied ? "text-green-400" : t?.textMuted || "text-gray-400"} hover:bg-black/10`}
    >
      {copied ? (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

export default function Answer({ ans, index, length, type, theme: t, animate }) {
  const [heading, setheading] = useState(false);
  const [cleanText, setCleanText] = useState(ans);

  function isBold(str) { return /^(\*)(\*)(.*)\*$/.test(str); }
  function stripBold(str) { return str.replace(/^(\*)(\*)|(\*)$/g, ""); }

  useEffect(() => {
    if (isBold(ans)) { setheading(true); setCleanText(stripBold(ans)); }
  }, []);

  // Only animate AI answers, and only last answer group
  const shouldAnimate = animate && type === "a";
  const displayed = useTyping(cleanText, shouldAnimate);

  if (!cleanText || !cleanText.trim()) return null;

  // First line of AI answer = title
  if (index === 0 && length > 1)
    return (
      <p className={`group flex items-start gap-1 text-base font-semibold ${t?.answerText || "text-white"} mb-1`}>
        <span>{displayed}</span>
        <CopyBtn text={cleanText} theme={t} />
      </p>
    );

  if (heading)
    return (
      <p className={`group flex items-start gap-1 text-sm font-semibold ${t?.answerText || "text-gray-100"} mt-2`}>
        <span>{displayed}</span>
        <CopyBtn text={cleanText} theme={t} />
      </p>
    );

  return (
    <p className={`group flex items-start gap-1 text-sm ${t?.answerSub || "text-gray-300"} leading-relaxed`}>
      <span>{displayed}</span>
      <CopyBtn text={cleanText} theme={t} />
    </p>
  );
}