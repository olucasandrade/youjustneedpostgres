import { useState, useEffect, useCallback, useRef } from "react";

interface TypewriterOptions {
  speed?: number;
  commandSpeed?: number;
  lineDelay?: number;
  startDelay?: number;
  onComplete?: () => void;
}

export function useTypewriter(
  lines: string[],
  shouldStart: boolean,
  options: TypewriterOptions = {}
) {
  const {
    speed = 30,
    commandSpeed = 18,
    lineDelay = 400,
    startDelay = 300,
    onComplete,
  } = options;

  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const reset = useCallback(() => {
    setDisplayedLines([]);
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setIsComplete(false);
    setIsTyping(false);
  }, []);

  useEffect(() => {
    if (!shouldStart || lines.length === 0) return;

    // Reset state on mount (handles StrictMode double-mount)
    setDisplayedLines([]);
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setIsComplete(false);
    setIsTyping(false);

    const timeout = setTimeout(() => {
      setIsTyping(true);
      setDisplayedLines([""]);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [shouldStart, startDelay, lines.length]);

  useEffect(() => {
    if (!isTyping || isComplete) return;
    if (currentLineIndex >= lines.length) {
      setIsComplete(true);
      setIsTyping(false);
      onCompleteRef.current?.();
      return;
    }

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex >= currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((i) => i + 1);
        setCurrentCharIndex(0);
        setDisplayedLines((prev) => [...prev, ""]);
      }, lineDelay);
      return () => clearTimeout(timeout);
    }

    const isCommand = currentLine.startsWith("$");
    const isComment = currentLine.startsWith("--") || currentLine.includes("--");
    const charSpeed = isCommand ? commandSpeed : isComment ? speed * 0.7 : speed;
    const jitter = Math.random() * charSpeed * 0.5;

    const timeout = setTimeout(() => {
      setDisplayedLines((prev) => {
        const next = [...prev];
        next[currentLineIndex] = currentLine.slice(0, currentCharIndex + 1);
        return next;
      });
      setCurrentCharIndex((i) => i + 1);
    }, charSpeed + jitter);

    return () => clearTimeout(timeout);
  }, [
    isTyping,
    isComplete,
    currentLineIndex,
    currentCharIndex,
    lines,
    commandSpeed,
    speed,
    lineDelay,
  ]);

  return { displayedLines, isComplete, isTyping, reset };
}
