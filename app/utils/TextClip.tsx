
const TextClip = (text?: string | null) => { // null/undefined kabul et
    if (!text) return ""; // Eğer text yoksa boş string dön
    if (text.length < 15) return text;
    return text.substring(0, 20) + "...";
  }
export default TextClip