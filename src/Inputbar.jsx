

import { useRef, useState } from "react";

export default function InputBar({
  question,
  askquestion,
  loading,
  isListening,
  startVoice,
  handlequestion,
  theme,
  t,
}) {
  const [imagePreview, setImagePreview] = useState(null); // base64 preview URL
  const [imageData, setImageData]       = useState(null); // pure base64 string
  const [imageMime, setImageMime]       = useState(null); // e.g. "image/png"
  const fileInputRef                    = useRef(null);

  // ── Image pick ───────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;               // "data:image/png;base64,XXXX"
      setImagePreview(result);
      setImageData(result.split(",")[1]);          // pure base64
      setImageMime(file.type);                    // "image/png" etc.
    };
    reader.readAsDataURL(file);
    e.target.value = "";                          // reset so same file can be re-picked
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageData(null);
    setImageMime(null);
  };

  // ── Send (passes image data up to App) ───────────────────────
  const onSend = () => {
    handlequestion(imageData, imageMime);
    removeImage();
  };

  const canSend = (question.trim() || imageData) && !loading;

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">

        {/* Image preview strip */}
        {imagePreview && (
          <div className="mb-2 flex items-center gap-2">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Selected"
                className="h-16 w-16 object-cover rounded-xl border border-white/20"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs leading-none hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                ×
              </button>
            </div>
            <span className={`text-xs ${t.textMuted}`}>Image attached</span>
          </div>
        )}

        {/* Input box */}
        <div
          className={`flex items-end gap-2 ${t.inputBg} rounded-2xl px-4 py-3 border ${t.border} ${t.focusBorder} transition-colors shadow-sm`}
        >
          <textarea
            value={question}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            onChange={(e) => {
              askquestion(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
            }}
            className={`flex-1 bg-transparent outline-none ${t.textInput} resize-none text-sm leading-relaxed min-h-6 max-h-40 overflow-y-auto`}
            placeholder={isListening ? "Listening… speak now" : "Ask Gemini"}
            rows={1}
          />

          <div className="flex items-center gap-2 shrink-0">

            {/* Image upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach image"
              className={`p-1.5 rounded-full transition-all duration-200
                ${imageData
                  ? "text-blue-400 bg-blue-500/10"
                  : `${t.textMuted} hover:bg-black/10`
                }`}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </button>

            {/* Mic button */}
            <button
              onClick={startVoice}
              title={isListening ? "Stop listening" : "Speak"}
              className={`relative p-1.5 rounded-full transition-all duration-200
                ${isListening
                  ? "text-red-400 bg-red-500/10"
                  : `${t.textMuted} hover:bg-black/10`
                }`}
            >
              {isListening && (
                <span className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" />
              )}
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6" />
              </svg>
            </button>

            {/* Send button */}
            <button
              onClick={onSend}
              disabled={!canSend}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
                ${canSend
                  ? theme === "dark"
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                  : "bg-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                }`}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

          </div>
        </div>

    

      </div>
    </div>
  );
}