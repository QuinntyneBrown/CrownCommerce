"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const convo = await res.json();
      await fetch(`/api/chat/conversations/${convo.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: input }),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: "Thank you for your message! Our team will get back to you shortly." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50">
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-xl z-50 flex flex-col max-h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
        <CardTitle className="text-sm">Chat with us</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            How can we help you today?
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-muted"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2 text-sm animate-pulse">Typing...</div>
          </div>
        )}
      </CardContent>
      <form onSubmit={sendMessage} className="p-4 border-t border-border flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1" />
        <Button type="submit" size="icon" disabled={loading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
