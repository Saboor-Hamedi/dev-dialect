import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");

  // Handle inline code (single backticks) or code without a language specified
  // This prevents the heavy block renderer from taking over simple <code> tags in tables/lists
  if (inline || !match) {
    return (
      <code
        className={`${className} bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-500`}
        {...props}
      >
        {children}
      </code>
    );
  }

  const handleCopy = async () => {
    if (!children) return;

    try {
      await navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden">
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-slate-700/50 hover:bg-slate-700 text-gray-300 hover:text-white backdrop-blur-sm transition-all border border-slate-600/50"
          title="Copy code"
        >
          {isCopied ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>

      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        className="!m-0 !rounded-lg !bg-slate-900 !p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        showLineNumbers={true}
        wrapLines={true}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
