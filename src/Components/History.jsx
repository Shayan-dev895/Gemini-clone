function History({ setselecthistory, history, sethistory, theme: t }) {
  function clearSearch() {
    localStorage.removeItem("history");
    sethistory([]);
  }

  return (
    <div>
      {history && history.length > 0 && (
        <div className="flex items-center justify-between px-3 mb-1">
          <span className={`text-xs ${t.textFaint}`}>Searches</span>
          <button onClick={clearSearch} title="Clear history" className={`${t.textMuted} hover:text-red-400 transition-colors`}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      )}
      <ul className="space-y-0.5">
        {history && history.map((item, index) => (
          <li
            key={index}
            onClick={() => setselecthistory(item)}
            className={`truncate text-sm ${t.textMuted} ${t.hoverItem} rounded-xl px-3 py-2 cursor-pointer transition-colors`}
            title={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;