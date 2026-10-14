import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Clock, 
  MessageSquare, 
  User, 
  Sparkles,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function PickupCoordinationModal({ item, isOpen, onClose }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch real messages from MongoDB Atlas
  const fetchMessages = async (isBackground = false) => {
    if (!item?._id) return;
    try {
      if (!isBackground) setLoading(true);
      const res = await api.get(`/messages/${item._id}`);
      if (res.data?.messages) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && item?._id) {
      fetchMessages();
      // Auto-refresh chat every 3.5 seconds so both users see incoming replies live
      const interval = setInterval(() => {
        fetchMessages(true);
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [isOpen, item?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const steps = [
    { num: 1, label: 'Claimed', desc: 'Matched' },
    { num: 2, label: 'On My Way', desc: 'Walking' },
    { num: 3, label: 'At Landmark', desc: 'Outside room' },
    { num: 4, label: 'Completed', desc: 'Picked up' },
  ];

  const quickPresets = [
    "I'm on my way, will be there in 5 mins! 🚶",
    "I'm outside the room / desk now 🚪",
    "Where should I look for you? 👀",
    "Got the food, thank you so much! 🍱"
  ];

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || sending) return;

    setSending(true);
    try {
      const res = await api.post(`/messages/${item._id}`, { text: text.trim() });
      if (res.data?.chatMessage) {
        setMessages((prev) => [...prev, res.data.chatMessage]);
      }
      setInputMsg('');
      scrollToBottom();
    } catch (err) {
      // Local fallback in case of network issue
      const fallbackMsg = {
        _id: String(Date.now()),
        sender: { _id: user?.id || user?._id, name: user?.name || 'Me' },
        text: text.trim(),
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setInputMsg('');
      toast('Message sent locally', { icon: '💬' });
    } finally {
      setSending(false);
    }
  };

  const handleAdvanceStep = (stepNum) => {
    setCurrentStep(stepNum);
    if (stepNum === 2) {
      toast.success('Status updated: Walking over to pickup spot 🚶');
    } else if (stepNum === 3) {
      toast.success('Status updated: Arrived at landmark 📍');
    } else if (stepNum === 4) {
      toast.success('Pickup completed! Good food rescued 🎉');
    }
  };

  // Determine other user's name
  const currentUserId = user?.id || user?._id;
  const posterId = typeof item.postedBy === 'object' ? item.postedBy?._id : item.postedBy;
  const isPoster = currentUserId && String(currentUserId) === String(posterId);
  const otherPartyName = isPoster 
    ? (item.claimedBy?.name || 'Claimant Student') 
    : (item.postedBy?.name || 'Meal Donor');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0 hidden sm:block" onClick={onClose} />

      {/* Modal / Mobile Drawer Card */}
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-0 sm:border border-slate-200/90 z-10 flex flex-col h-full sm:h-auto sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="sm:hidden p-1.5 -ml-1 text-slate-300 hover:text-white rounded-lg"
              aria-label="Back"
            >
              <ArrowLeft size={19} />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shrink-0">
              💬
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-sm sm:text-base leading-tight truncate">
                Coordination Chat with {otherPartyName}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                Re: <strong className="text-white">{item.title}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchMessages()}
              title="Refresh messages"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="hidden sm:flex p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stepper Bar (Transfer Progress) */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200/80 shrink-0">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Handoff Milestones
          </p>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {steps.map((s) => {
              const isPastOrCurrent = currentStep >= s.num;
              const isCurrent = currentStep === s.num;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => handleAdvanceStep(s.num)}
                  className={`p-1.5 sm:p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : isPastOrCurrent
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-black">
                    <span>{s.num}. {s.label}</span>
                    {isPastOrCurrent && <CheckCircle2 size={12} className={isCurrent ? 'text-white' : 'text-emerald-600'} />}
                  </div>
                  <p className={`text-[9px] sm:text-[10px] mt-0.5 hidden sm:block ${isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {s.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pickup Landmark Bar */}
        <div className="px-4 sm:px-5 py-2 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-950 shrink-0">
          <div className="flex items-center gap-1.5 truncate max-w-md">
            <MapPin size={13} className="text-emerald-700 shrink-0" />
            <span className="truncate"><strong>Meet At:</strong> {item.pickupLocation}</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 hidden sm:inline">
            Active Real-time Chat
          </span>
        </div>

        {/* Real Chat Messages View */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#F8FAFC]">
          {messages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-1">
              <MessageSquare size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-600">Start the conversation</p>
              <p className="text-[11px]">Coordinate exact meeting spot, timing, or container details.</p>
            </div>
          ) : (
            messages.map((m) => {
              const msgSenderId = typeof m.sender === 'object' ? m.sender?._id : m.sender;
              const isMe = currentUserId && String(msgSenderId) === String(currentUserId);
              const senderDisplayName = isMe ? 'You' : (typeof m.sender === 'object' ? m.sender?.name : otherPartyName);
              const timeString = m.createdAt 
                ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now';

              return (
                <div
                  key={m._id || m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 px-1 mb-0.5">
                    {senderDisplayName}
                  </span>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed break-words">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {timeString}
                  </span>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Presets Horizontal Carousel */}
        <div className="px-3 sm:px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-1.5 shrink-0 scrollbar-none">
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(preset)}
              className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 rounded-lg border border-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0 pb-safe">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type message (e.g. I'm wearing a green jacket)..."
            className="flex-1 px-3.5 sm:px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={sending || !inputMsg.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={15} />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
