const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const Url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`