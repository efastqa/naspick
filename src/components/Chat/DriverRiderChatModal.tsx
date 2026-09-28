import React, { useState } from 'react';
import { MessageSquare, Send, Phone, X, CheckCheck, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { Driver, ChatMessage } from '../../types';

interface DriverRiderChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver;
  onStartCall: () => void;
}

export const DriverRiderChatModal: React.FC<DriverRiderChatModalProps> = ({
  isOpen,
  onClose,
  driver,
  onStartCall,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'system',
      text: 'Ayubowan! Chat connection is active and number-masked for your privacy.',
      timestamp: 'Just now',
      status: 'read',
    },
    {
      id: 'msg_2',
      sender: 'driver',
      text: `Hello! This is ${driver.name}. I am in ${driver.vehicleModel} (${driver.vehiclePlate}). En route to your pickup point.`,
      timestamp: 'Just now',
      status: 'read',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const quickReplies = [
    { en: 'Waiting at main gate', si: 'ප්‍රධාන ගේට්ටුව ළඟ' },
    { en: 'Traffic near roundabout (2 mins)', si: 'වටරවුම ළඟ ට්‍රැෆික්' },
    { en: 'Holding an umbrella', si: 'කුඩයක් අතැතිව' },
    { en: 'Please turn on AC', si: 'කරුණාකර AC දමන්න' },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputMsg.trim();
    if (!content) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sender: 'rider',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputMsg('');

    // Simulate driver automated reply after 1.5s
    setTimeout(() => {
      const driverReplies = [
        'Hari sir, I see you! Turning onto the road now.',
        'Noted! Arriving in 1 minute.',
        'AC is already on. Have a comfortable ride!',
        'No problem, see you at the gate.',
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          sender: 'driver',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        },
      ]);
    }, 1500);
  };

  return (
    <div
      id="driver-chat-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full h-[540px] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm leading-tight">{driver.name}</h4>
                <span className="px-1.5 py-0.2 bg-slate-800 font-mono text-[10px] text-emerald-400 rounded">
                  {driver.vehiclePlate}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                ★ {driver.rating} • {driver.vehicleModel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Trigger Audio Call */}
            <button
              onClick={() => {
                onClose();
                onStartCall();
              }}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
              title="Call Driver via Masked Line"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
          {messages.map((m, mIdx) => {
            if (m.sender === 'system') {
              return (
                <div key={`${m.id || 'sys'}_${mIdx}`} className="text-center my-1">
                  <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-[10px] text-slate-300 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{m.text}</span>
                  </span>
                </div>
              );
            }

            const isRider = m.sender === 'rider';
            return (
              <div
                key={`${m.id || 'msg'}_${mIdx}`}
                className={`flex flex-col ${isRider ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2.5 rounded-2xl text-xs ${
                    isRider
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-1 px-1">
                  <span>{m.timestamp}</span>
                  {isRider && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Replies Carousel */}
        <div className="p-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(`${qr.en} (${qr.si})`)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700 transition-colors flex-shrink-0"
            >
              {qr.en}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type message to Kasun..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-50"
            disabled={!inputMsg.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
