import React, { useState } from 'react';
import { MessageSquare, X, Smartphone, CheckCheck, Clock, ShieldCheck, Bell, Radio } from 'lucide-react';
import { SmsNotification, PushNotification } from '../../types';

interface SmsNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  smsList: SmsNotification[];
  pushList: PushNotification[];
  onClearNotifications?: () => void;
}

export const SmsNotificationDrawer: React.FC<SmsNotificationDrawerProps> = ({
  isOpen,
  onClose,
  smsList,
  pushList,
}) => {
  const [activeTab, setActiveTab] = useState<'sms' | 'push'>('sms');

  if (!isOpen) return null;

  return (
    <div 
      id="sms-notification-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-heading">
                Sri Lanka Telecom SMS Gateway
              </h3>
              <p className="text-[10px] text-slate-400">Dialog • Mobitel • Hutch Delivery Network</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'sms'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Automated SMS ({smsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('push')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'push'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>In-App Push Alerts ({pushList.length})</span>
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {activeTab === 'sms' ? (
            smsList.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No SMS dispatched yet. Book a ride to trigger automated SMS updates!
              </div>
            ) : (
              smsList.map((sms) => (
                <div
                  key={sms.id}
                  className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 shadow-sm relative space-y-2 text-xs"
                >
                  {/* SMS Metadata */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-400 font-mono">{sms.senderId}</span>
                      <span>•</span>
                      <span className="text-slate-400">{sms.carrier}</span>
                    </div>
                    <span className="text-slate-500">{sms.timestamp}</span>
                  </div>

                  {/* SMS Bubble Body */}
                  <p className="text-slate-200 text-xs font-sans leading-relaxed bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
                    {sms.message}
                  </p>

                  {/* Delivery Status */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>To: {sms.recipientPhone}</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCheck className="w-3 h-3" />
                      <span>Delivered</span>
                    </span>
                  </div>
                </div>
              ))
            )
          ) : pushList.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No push notifications yet.
            </div>
          ) : (
            pushList.map((push) => (
              <div
                key={push.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3 text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">{push.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{push.body}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{push.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Naspick Sri Lanka Automated Communication Engine • TRCSL Compliant
        </div>
      </div>
    </div>
  );
};
