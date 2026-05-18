import Answer from "./Answer";

function Chatlist({ text, theme: t }) {
  let lastAIndex = -1;
  text.forEach((item, i) => { if (item.type === "a") lastAIndex = i; });

  return (
    <div className="space-y-6">
      {text.map((item, index) =>
        item.type === "q" ? (
          // ── User bubble ──────────────────────────────────────────
          <div key={index} className="flex justify-end">
            <div className={`group relative max-w-[75%] md:max-w-[60%] ${t.msgBubble} text-sm px-4 py-3 rounded-2xl rounded-tr-sm`}>
              {/* Image preview if sent with message */}
              {item.image && (
                <img
                  src={item.image}
                  alt="uploaded"
                  className="mb-2 max-h-48 w-full object-cover rounded-xl"
                />
              )}
              <span>{item.text}</span>
              {/* Hover copy */}
              <button
                onClick={() => navigator.clipboard.writeText(item.text)}
                title="Copy"
                className={`absolute -bottom-5 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${t.textMuted}`}
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // ── AI answer ────────────────────────────────────────────
          <div key={index} className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold text-white mt-0.5">
              G
            </div>
            <div className="flex-1 text-sm leading-relaxed space-y-1">
              {item.text.map((ansitem, ansindex) => (
                <Answer
                  key={ansindex}
                  ans={ansitem}
                  length={item.text.length}
                  index={ansindex}
                  type={item.type}
                  theme={t}
                  animate={index === lastAIndex}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Chatlist;