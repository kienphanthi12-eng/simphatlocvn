"use client"

import React, { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Sparkles, Compass, RefreshCw } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

type ReactPart = React.ReactNode

// Render a plain string segment, converting **bold** and *italic* inline
function renderInlineMarkdown(text: string, keyPrefix: string): ReactPart[] {
  const result: ReactPart[] = []
  // Combined regex: **bold** | *italic*
  const inlineRegex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = inlineRegex.exec(text)) !== null) {
    if (m.index > last) result.push(text.slice(last, m.index))
    if (m[0].startsWith("**")) {
      result.push(<strong key={`${keyPrefix}-b-${m.index}`} className="font-bold text-ink">{m[2]}</strong>)
    } else {
      result.push(<em key={`${keyPrefix}-i-${m.index}`} className="italic">{m[3]}</em>)
    }
    last = inlineRegex.lastIndex
  }
  if (last < text.length) result.push(text.slice(last))
  return result
}

const parseMessageContent = (content: string): ReactPart[] => {
  // First pass: split on markdown links [label](url), then apply inline formatting to text segments
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: ReactPart[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...renderInlineMarkdown(content.slice(lastIndex, match.index), `pre-${match.index}`))
    }
    parts.push(
      <a
        key={`link-${match.index}`}
        href={match[2]}
        className="text-[#7F1D1D] hover:text-[#991B1B] font-bold underline transition-colors mx-0.5"
      >
        {match[1]}
      </a>
    )
    lastIndex = linkRegex.lastIndex
  }

  if (lastIndex < content.length) {
    parts.push(...renderInlineMarkdown(content.slice(lastIndex), `tail`))
  }

  return parts
}

export function PhongThuyChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Kính chào Quý chủ nhân! Lão phu là Thầy Phong Thủy AI của Sim Phát Lộc. để khai quang bảo số trợ vận chuẩn xác nhất, xin hỏi chủ nhân sinh năm bao nhiêu âm lịch và là Nam hay Nữ mạng?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("spl_ai_chat_history")
      if (saved) {
        try {
          setMessages(JSON.parse(saved))
        } catch (e) {
          console.error("Error loading chat history:", e)
        }
      }
    }
  }, [])

  // Save chat history to sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      sessionStorage.setItem("spl_ai_chat_history", JSON.stringify(messages))
    }
  }, [messages])

  const quickPrompts = [
    "🔮 Mệnh Hỏa hợp số nào?",
    "📈 Sim thăng tiến công danh",
    "👤 Tư vấn nam sinh năm 1996",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return

    const newMessages = [...messages, { role: "user" as const, content: textToSend }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      } else {
        throw new Error(data.error || "Lỗi kết nối")
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lão phu vừa gieo quẻ nhưng trời đất đang chuyển dịch làm nhiễu loạn thiên cơ, chưa thể phản hồi ngay. Quý chủ nhân vui lòng thử hỏi lại sau giây lát.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (window.confirm("Chủ nhân có muốn tẩy trần, lập lại quẻ đàm đạo mới không?")) {
      setMessages([
        {
          role: "assistant",
          content: "Kính chào Quý chủ nhân. Lão phu đã chuẩn bị sẵn sàng nhang thơm và quẻ dịch để bắt đầu cuộc trò chuyện mới. Quý chủ nhân sinh năm bao nhiêu âm lịch và đang muốn mưu cầu điều chi?",
        },
      ])
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-serif">
      
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group w-14 h-14 rounded-full lacquer border-2 border-gold-deep bg-[#7F1D1D] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {/* Subtle pulse golden ring */}
          <span className="absolute inset-0 rounded-full border border-gold animate-ping opacity-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center justify-center text-gold-soft">
            <Compass className="h-6 w-6 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="text-[7px] uppercase tracking-wider font-sans font-black mt-0.5 text-gold">Thầy AI</span>
          </div>
          
          {/* Imperial cloud graphic backdrop */}
          <div className="absolute inset-0 bg-cloud-pattern opacity-[0.08] pointer-events-none" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[500px] corner-ornament border border-gold-deep bg-parchment rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="lacquer px-5 py-4 border-b border-gold-deep/30 flex items-center justify-between relative shrink-0">
            <div className="absolute inset-0 bg-cloud-pattern opacity-[0.05] pointer-events-none" />
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-8 h-8 rounded-full border border-gold bg-crimson-deep/60 flex items-center justify-center">
                <Compass className="h-4.5 w-4.5 text-gold-soft animate-spin" style={{ animationDuration: "15s" }} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gold-soft tracking-wider">Thầy Phong Thủy AI</h3>
                <p className="text-[8.5px] uppercase tracking-[0.2em] text-gold-soft/70">Khai Vận Linh Số</p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={handleReset}
                title="Đặt lại trò chuyện"
                className="p-1 rounded-md text-gold-soft/60 hover:text-gold-soft hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-gold-soft/60 hover:text-gold-soft hover:bg-white/10 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 relative">
            <div className="absolute inset-0 bg-cloud-pattern opacity-[0.015] pointer-events-none" />
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6.5 h-6.5 rounded-full border border-gold-deep/30 bg-[#7F1D1D] flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="h-3 w-3 text-gold-soft" />
                  </div>
                )}
                
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed shadow-xs ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#7F1D1D] to-[#991B1B] text-gold-soft border border-gold-deep/30 font-semibold"
                      : "bg-white/95 text-ink border border-gold-deep/15 leading-relaxed font-sans font-medium whitespace-pre-line"
                  }`}
                >
                  {msg.role === "assistant" ? parseMessageContent(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {/* AI Loading bubble */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6.5 h-6.5 rounded-full border border-gold-deep/30 bg-[#7F1D1D] flex items-center justify-center shrink-0">
                  <Sparkles className="h-3 w-3 text-gold-soft animate-ping" />
                </div>
                <div className="bg-white/95 text-ink/75 border border-gold-deep/15 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gold-deep rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-gold-deep rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-gold-deep rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-[10px] text-ink/40 uppercase tracking-widest font-bold ml-1">Đang bấm quẻ…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 bg-gold/5 border-t border-gold-deep/10 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt.replace(/🔮 |📈 |👤 /, ""))}
                className="bg-white border border-gold-deep/25 text-ink/75 hover:border-gold-deep/60 hover:text-ink text-[10px] font-sans font-bold px-3 py-1.5 rounded-full shadow-2xs whitespace-nowrap cursor-pointer transition-all shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-gold-deep/20 flex gap-2 items-center shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Hỏi Thầy về bản mệnh, tìm sim hợp mệnh..."
              className="flex-1 bg-transparent border-b border-gold-deep/30 focus:border-gold-deep text-ink text-xs font-sans py-2 px-1 outline-none transition-colors placeholder:text-ink/30"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7F1D1D] to-[#991B1B] border border-gold-deep/40 text-gold-soft flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer shadow-xs shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  )
}
