"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, MessageSquare, Bot, User } from "lucide-react";
import { CitationText } from "../analysis/CitationBadge";
import { cn, formatDate } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: number[];
  createdAt: Date;
}

interface ChatInterfaceProps {
  caseId: string;
  initialMessages?: Message[];
  onCitationClick?: (page: number) => void;
}

export default function ChatInterface({
  caseId,
  initialMessages = [],
  onCitationClick,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    // Add user message optimistically
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, message: userMessage }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: data.message.id,
        role: "assistant",
        content: data.message.content,
        citations: data.message.citations,
        createdAt: new Date(data.message.createdAt),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      // Remove the optimistic user message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "Summarize the key evidence on page 1",
    "What are the timeline inconsistencies?",
    "Draft a cross-examination question",
    "What procedural issues exist?",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-white">
        <MessageSquare className="h-5 w-5 text-[var(--primary)]" />
        <h3 className="font-semibold text-slate-900">Case Q&A</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-[var(--primary)] mx-auto mb-4 opacity-50" />
            <p className="text-slate-600 mb-4">
              Ask questions about the case. I&apos;ll provide answers with citations.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-full hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-3",
                  message.role === "user"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-white border border-slate-200"
                )}
              >
                {message.role === "assistant" ? (
                  <div className="text-slate-700 whitespace-pre-wrap">
                    <CitationText text={message.content} onCitationClick={onCitationClick} />
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
                <p
                  className={cn(
                    "text-xs mt-2",
                    message.role === "user" ? "text-white/70" : "text-slate-400"
                  )}
                >
                  {formatDate(message.createdAt)}
                </p>
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 flex-shrink-0">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] flex-shrink-0">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing case files...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-[var(--error-light)] border border-[var(--error)]/30 rounded-lg px-4 py-3 text-[var(--error)]">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border)] bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the case..."
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "flex items-center justify-center rounded-lg px-4 py-2 transition-all",
              isLoading || !input.trim()
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
