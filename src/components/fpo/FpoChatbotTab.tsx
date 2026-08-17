import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  Bot,
  User,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Building,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { LanguageCode } from "../../types";
import { soundEffects, speakText, createSpeechRecognizer } from "../../utils/audio";
import { AudioButton } from "../common/AudioButton";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  actionPrompt?: string;
}

interface FpoChatbotTabProps {
  currentLanguage: LanguageCode;
  onNavigateTab?: (tab: string) => void;
}

export const FpoChatbotTab: React.FC<FpoChatbotTabProps> = ({
  currentLanguage,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init",
      sender: "bot",
      text: "Namaste Secretary Rathore! I am your FPO AgriVision Organization Intelligence Copilot. I analyze real-time cluster telemetry across your 342 linked farmer members, IoT sensor telemetry, and Mandi price trends.\n\nHow may I assist your cooperative administration today?",
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "How many members have low soil moisture this week?",
    "Which crops are most at risk in our district right now?",
    "Generate a regional spray advisory for early blight",
    "Draft a harvest labour pooling schedule for soybean",
    "Show me PM-KISAN pending enrollment summary",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    soundEffects.click();
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    // Simulate smart domain-specific AI logic
    setTimeout(() => {
      setIsThinking(false);
      soundEffects.success();

      let botReply = "";
      let actionSuggestion = "";
      const lower = query.toLowerCase();

      if (lower.includes("moisture") || lower.includes("soil")) {
        botReply =
          "📊 **Soil Moisture Analysis Across FPO:**\n• **6 member farms** currently report critical soil moisture (<25%) via active ESP32 IoT sensors.\n• The most affected cluster is **Gram Tajpur & Gram Pipliya**.\n• Recommendation: Coordinate with the district canal division for next water rotation on Thursday, or trigger a drip-irrigation advisory.";
        actionSuggestion = "broadcast";
      } else if (lower.includes("risk") || lower.includes("district") || lower.includes("crops")) {
        botReply =
          "⚠️ **Cluster Risk Vulnerability:**\n• **Tomato & Potato plots (85 acres)** in Unhel block are under elevated risk due to early leaf blight outbreak.\n• **Soybean (680 acres)** is in good vegetative stage, but 41 farms show medium fungal vector vulnerability following recent high humidity (78%).\n• Total high-risk member farms: **41 (12%)**.";
        actionSuggestion = "reports";
      } else if (lower.includes("spray") || lower.includes("blight") || lower.includes("advisory")) {
        botReply =
          "📋 **Draft Regional Advisory Protocol:**\n'Attention Tomato/Potato farmers: Concentric brown spot leaf blight identified in Unhel & Tajpur blocks. Apply **Mancozeb 75% WP @ 2.5g/L** or **Bio-Trichoderma viride @ 5ml/L** before evening. Ensure 48hr rain-free window.'\n\nWould you like to dispatch this broadcast to all 40 Tomato growers?";
        actionSuggestion = "broadcast";
      } else if (lower.includes("labour") || lower.includes("harvest") || lower.includes("schedule")) {
        botReply =
          "🌾 **Soybean Harvest Labour Aggregation:**\n• Peak harvest window is estimated for **Sept 28 – Oct 12**.\n• Total pooled labour requirement: **85 skilled workers** across 18 participating farms.\n• Recommended daily rate: **₹550/day + group tractor transit**.\n• 140 registered local workers are currently available in the Labour Directory.";
        actionSuggestion = "broadcast";
      } else if (lower.includes("pm-kisan") || lower.includes("scheme") || lower.includes("enrollment")) {
        botReply =
          "🏛️ **Government Scheme Status Summary:**\n• **PM-KISAN:** 312 Enrolled (91%), 30 Pending e-KYC validation.\n• **Soil Health Card:** 265 Completed (77%), 77 Awaiting soil sample collection.\n• **PMFBY Crop Insurance:** 284 Enrolled (83%).\n\nYou can export the pending member list to CSV from the Reports tab.";
        actionSuggestion = "reports";
      } else {
        botReply = `Based on your FPO's database (342 member farmers, 1,480 acres in Ujjain Rural):\n• Aggregated cluster risk is currently 32/100 (Safe Aggregate).\n• 74 connected IoT telemetry sensors are transmitting.\n• Live Mandi soybean rate is ₹4,650/Qtl (+₹80 above MSP).\n\nFeel free to ask for specific member rosters, spray protocols, or labour pooling coordination!`;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionPrompt: actionSuggestion,
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(botReply.replace(/[*•#]/g, ""), currentLanguage);
    }, 1100);
  };

  const handleVoiceInput = () => {
    soundEffects.click();
    setIsListening(true);
    const recognizer = createSpeechRecognizer(
      currentLanguage,
      (transcript: string) => {
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
    if (!recognizer) {
      setIsListening(false);
      speakText("Voice recognition not supported in this browser mode", currentLanguage);
    } else {
      try {
        recognizer.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto flex flex-col h-[calc(100vh-210px)] min-h-[520px]">
      {/* Top Copilot Header */}
      <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-900 text-white flex items-center justify-center text-xl">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-stone-900">
                FPO Admin Intelligence AI
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950">
                Live Data Connected
              </span>
            </div>
            <p className="text-xs font-bold text-stone-700">
              Scoped to 342 member farmers & telemetry
            </p>
          </div>
        </div>

        <AudioButton
          textToSpeak="FPO AI Copilot. Ask questions about your member farmers, crop risk distributions, disease advisories, or labour pools."
          language={currentLanguage}
          size="sm"
        />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-stone-50 rounded-3xl border-2 border-stone-200 p-4 overflow-y-auto space-y-3.5 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-black ${
                msg.sender === "user" ? "bg-indigo-700" : "bg-indigo-950"
              }`}
            >
              {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl space-y-1.5 shadow-xs ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-xs"
                  : "bg-white text-stone-900 border border-stone-200 rounded-tl-xs"
              }`}
            >
              <div className="text-xs sm:text-sm font-semibold whitespace-pre-line leading-relaxed">
                {msg.text}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/5 text-[10px] opacity-70">
                <span>{msg.timestamp}</span>
                {msg.sender === "bot" && (
                  <button
                    type="button"
                    onClick={() => speakText(msg.text.replace(/[*•#]/g, ""), currentLanguage)}
                    className="flex items-center gap-1 hover:opacity-100 font-bold"
                  >
                    <Volume2 size={12} />
                    <span>Listen</span>
                  </button>
                )}
              </div>

              {msg.actionPrompt && onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab(msg.actionPrompt!)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-black text-xs border border-indigo-200 flex items-center justify-center gap-1.5"
                >
                  <span>Go to {msg.actionPrompt.toUpperCase()} Tab</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-stone-700 text-xs font-bold p-2 bg-white rounded-2xl border border-stone-200 w-fit">
            <Sparkles size={14} className="text-indigo-600 animate-spin" />
            <span>Analyzing 342 member records...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 border border-stone-200 text-xs font-bold whitespace-nowrap active:scale-95 transition-all shrink-0 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="bg-white p-2 sm:p-2.5 rounded-2xl border-2 border-stone-200 shadow-xs flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ask FPO AI anything (e.g. soil moisture, outbreaks, spray advisory)..."
          className="flex-1 text-xs sm:text-sm font-bold text-stone-900 px-2 py-1 bg-transparent focus:outline-hidden"
        />

        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-2.5 rounded-xl transition-all ${
            isListening
              ? "bg-rose-600 text-white animate-pulse"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
          title="Voice input"
        >
          <Mic size={18} />
        </button>

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black active:scale-95 transition-all shadow-xs"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
