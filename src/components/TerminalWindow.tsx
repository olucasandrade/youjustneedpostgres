import { type ReactNode } from "react";

interface TerminalWindowProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function TerminalWindow({ children, title = "bash", className = "" }: TerminalWindowProps) {
  return (
    <div className={`terminal ${className}`}>
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        <span className="ml-3 text-xs text-muted select-none">{title}</span>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}
