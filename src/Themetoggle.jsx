
export const themes = {
  dark: {
    bg:          "bg-[#1e1f20]",
    sidebar:     "bg-[#1e1f20]",
    inputBg:     "bg-[#2d2e30]",
    newChatBtn:  "bg-[#2d2e30] hover:bg-[#3c3d3f]",
    hoverItem:   "hover:bg-[#2d2e30]",
    border:      "border-white/10",
    focusBorder: "focus-within:border-white/30",
    text:        "text-white",
    textMuted:   "text-gray-400",
    textFaint:   "text-gray-600",
    textInput:   "text-white placeholder-gray-500",
    msgBubble:   "bg-[#2d2e30] text-white",
    answerText:  "text-gray-200",
    answerSub:   "text-gray-300",
    themeLabel:  "Light mode",
  },
  light: {
    bg:          "bg-[#f0f4f9]",
    sidebar:     "bg-[#f0f4f9]",
    inputBg:     "bg-white",
    newChatBtn:  "bg-white hover:bg-gray-100",
    hoverItem:   "hover:bg-white",
    border:      "border-black/10",
    focusBorder: "focus-within:border-black/30",
    text:        "text-gray-900",
    textMuted:   "text-gray-500",
    textFaint:   "text-gray-400",
    textInput:   "text-gray-900 placeholder-gray-400",
    msgBubble:   "bg-[#dde3ea] text-gray-900",
    answerText:  "text-gray-800",
    answerSub:   "text-gray-600",
    themeLabel:  "Dark mode",
  },
};

const SunIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export { SunIcon, MoonIcon };

export default function ThemeToggle({ theme, toggleTheme, t, title }) {
  return (
    <button
      onClick={toggleTheme}
      title={title || t.themeLabel}
      className={`p-2 rounded-full ${t.hoverItem} ${t.textMuted} transition-all duration-200`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}