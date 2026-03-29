import { useEffect, useState } from 'react';

function TypingText({ text = '', speed = 15 }) {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    let index = 0;
    setTyped('');

    const intervalId = setInterval(() => {
      index += 1;
      setTyped(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <span>{typed}</span>;
}

export default TypingText;
