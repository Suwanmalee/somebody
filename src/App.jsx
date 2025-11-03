import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from "framer-motion";
import ChatModal from './components/chatmodal.jsx';
import {
  PawPrint, 
  X,    
  Zap,    
  Heart, 
  RefreshCcw, 
  MessagesSquare, 
  Send, 
} from 'lucide-react'; 

import { AudioLines } from 'lucide-react';


const DUMMY_HAMSTERS = [
  {
    id: 1,
    name: '김영광',
    age: 38,
    bio: 'Quiet guy, thinker, and coffee enthusiast. Enjoys simple moments and deep conversations.☕✨',
    img: 'https://i.pinimg.com/736x/df/2d/05/df2d058f604ca3df1decb2750eacbb63.jpg',
  },
  {
    id: 2,
    name: 'SilentGuy87',
    age: 28,
    bio: 'Quiet type, loves coffee and late-night walks. Swipe if you enjoy calm vibes and meaningful chats.🌙',
    img: 'https://i.pinimg.com/736x/18/f8/0b/18f80b6c5519910df75a4a002fc4dbd6.jpg',
  },
  {
    id: 3,
    name: 'SunsetDreamer',
    age: 27,
    bio: 'Quiet soul, loves evening walks and calm horizons.',
    img: 'https://i.pinimg.com/1200x/98/10/a2/9810a2b97c5a2069f67b89cfa2cccbb5.jpg',
  },
  {
    id: 4,
    name: 'Hardin Scott',
    age: 27,
    bio: 'Bad boy with a soft heart. Loves music, tattoos & chaos.🎸🔥',
    img: 'https://i.pinimg.com/1200x/70/60/9e/70609e273c75e432e805d0fb67e05c27.jpg',
  },
];

// --- Constants ---
const SWIPE_THRESHOLD = 120; // ระยะ px ที่ต้องปัดเพื่อ trigger
const SWIPE_OUT_DURATION = 300; // 300ms

// --- (เพิ่มใหม่) ข้อความสุ่มจากหนุ่มๆ ---
const HAMSTER_REPLIES = [
"Hey! What’s good? Just chilling here, and you?",

"Just finished working out, thought I’d hit you up.",

"Taking a quick break to reply before dinner.",

"Caught myself daydreaming about our first meet-up.",

"Sorry, got caught up with work. Back now!",

"Thinking what to cook tonight, any ideas?",

"You mentioned snacks? I’m always down for food talk.",

"Getting comfy here, ready to chat whenever you are.",
];


const HamsterCard = React.forwardRef(
  ({ hamster, onSwipe }, ref) => {
    const [style, setStyle] = useState({
      transform: 'translateX(0px) rotate(0deg)',
      transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
    });
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const positionRef = useRef({ x: 0, rotation: 0 });

    const handleDragStart = (e) => {
      isDraggingRef.current = true;
      startXRef.current = e.clientX || e.touches[0].clientX;
      setStyle((s) => ({ ...s, transition: 'none' }));
    };

    const handleDragMove = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();

      const currentX = e.clientX || e.touches[0].clientX;
      const deltaX = currentX - startXRef.current;
      const rotation = deltaX / 20;

      positionRef.current = { x: deltaX, rotation };
      setStyle((s) => ({
        ...s,
        transform: `translateX(${deltaX}px) rotate(${rotation}deg)`,
      }));
    };

    const handleDragEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const { x } = positionRef.current;
      let direction = null;

      if (Math.abs(x) > SWIPE_THRESHOLD) {
        direction = x > 0 ? 'right' : 'left';
        swipeOut(direction);
      } else {
        snapBack();
      }
    };

    const snapBack = () => {
      positionRef.current = { x: 0, rotation: 0 };
      setStyle({
        transform: 'translateX(0px) rotate(0deg)',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
      });
    };

    const swipeOut = (direction) => {
      const x = direction === 'right' ? 500 : -500;
      const rotation = direction === 'right' ? 30 : -30;

      setStyle({
        transform: `translateX(${x}px) rotate(${rotation}deg)`,
        transition: `transform ${SWIPE_OUT_DURATION}ms ease-in`,
      });

      // เรียก callback onSwipe (like/nope) หลังจาก animation จบ
      setTimeout(() => {
        onSwipe(direction);
      }, SWIPE_OUT_DURATION);
    };

    // เปิดให้ component แม่เรียกใช้ฟังก์ชัน swipeOut ได้ (สำหรับปุ่ม)
    React.useImperativeHandle(ref, () => ({
      swipe: (direction) => {
        swipeOut(direction);
      },
    }));

    return (
      <div
        className="absolute w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        style={style}
      >
        <div className="relative w-full h-full bg-slate-100 rounded-2xl shadow-2xl overflow-hidden">
          <img
            src={hamster.img}
            alt={hamster.name}
            className="w-full h-3/4 object-cover"
            draggable="false"
          />
          <div className="p-5 absolute bottom-0 left-0 right-0 h-1/4 bg-slate-100">
            <h2 className="text-2xl font-bold text-gray-800">
              {hamster.name}, {hamster.age}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">{hamster.bio}</p>
          </div>

          <div
            className={`absolute top-10 left-10 text-4xl font-bold text-emerald-500 border-4 border-blue-500 px-4 py-2 rounded-lg transform -rotate-20 ${
              positionRef.current.x > SWIPE_THRESHOLD / 3 ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-200`}
            style={{ opacity: positionRef.current.x / (SWIPE_THRESHOLD / 2) }}
          >
            LIKE
          </div>
          <div
            className={`absolute top-10 right-10 text-4xl font-bold text-rose-500 border-4 border-blue-500 px-4 py-2 rounded-lg transform rotate-20 ${
              positionRef.current.x < -SWIPE_THRESHOLD / 3 ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-200`}
            style={{ opacity: -positionRef.current.x / (SWIPE_THRESHOLD / 2) }}
          >
            DISLIKE
          </div>
        </div>
      </div>
    );
  }
);

export default function App() {
  const [hamsters, setHamsters] = useState(DUMMY_HAMSTERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef(); 

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");


  const cardsToShow = useMemo(() => {
    return hamsters.slice(currentIndex).reverse();
  }, [hamsters, currentIndex]);


  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on ${hamsters[currentIndex].name}`);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };


  const handleNopeClick = () => {
    if (cardRef.current) {
      cardRef.current.swipe('left');
    }
  };

  const handleLikeClick = () => {
    if (cardRef.current) {
      cardRef.current.swipe('right');
    }
  };

  const handleBoostClick = () => {
  };


  const resetDeck = () => {
    setCurrentIndex(0);
  }

  const handleSendMessage = () => {
    const userMessageText = chatInput.trim();
    if (userMessageText === "") return;

    const userMessage = { id: Date.now(), text: userMessageText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setChatInput("");

    setTimeout(() => {
      const randomReplyText = HAMSTER_REPLIES[Math.floor(Math.random() * HAMSTER_REPLIES.length)];
      const hamsterReply = { id: Date.now() + 1, text: randomReplyText, sender: "hamster" };
      setMessages((prev) => [...prev, hamsterReply]);
    }, 1000 + Math.random() * 500); 
  };

  return (
    <div className="font-inter flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 p-4 overflow-hidden">
      
      <div className="flex items-center text-gray-700 mb-4">
        <AudioLines className="w-8 h-8 mr-2 text-sky-600" /> {/* ใช้ Lucide PawPrint */}
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-sky-600 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] hover:drop-shadow-[0_0_14px_rgba(56,189,248,0.8)] transition-all duration-300">somebody</h1>
      </div>


      <div className="relative w-full max-w-sm h-[550px] md:h-[600px] transition-all duration-500 ease-in-out">
        {cardsToShow.length > 0 ? (
          cardsToShow.map((hamster, index) => {
            const isTopCard = index === cardsToShow.length - 1;
            
            return (
              <HamsterCard
                key={hamster.id}
                ref={isTopCard ? cardRef : null}
                hamster={hamster}
                onSwipe={handleSwipe}
                
                
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center transition-all">
            <h2 className="text-2xl font-bold text-slate-800">No more matches!</h2>
            <p className="text-slate-600 mt-2">You've seen all profiles for now. Check back later for new connections.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={resetDeck}
                className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-full shadow-lg hover:bg-sky-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCcw size={20} />
                Start Over
              </button>
              <button
                onClick={() => setIsChatOpen(true)} // (เพิ่มใหม่) เปิด Chat
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessagesSquare size={20} />
                Chat Matches
              </button>
            </div>

          </div>
        )}
      </div>
    
      {/* Action Buttons */}
{cardsToShow.length > 0 && (
  <div className="flex justify-center items-center gap-6 mt-8 w-full max-w-sm">
    {/* Nope Button (X) */}
<button
  onClick={handleNopeClick}
  className="flex items-center justify-center w-16 h-16 bg-white border-2 border-rose-200 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
>
  <X className="w-8 h-8 text-rose-500" strokeWidth={3} />
</button>

{/* Boost Button (Lightning) */}
<button
  onClick={handleBoostClick}
  className="flex items-center justify-center w-14 h-14 bg-white border-2 border-indigo-200 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
>
  <Zap className="w-7 h-7 text-indigo-500" fill="currentColor" />
</button>

{/* Like Button (Heart) */}
<button
  onClick={handleLikeClick}
  className="flex items-center justify-center w-16 h-16 bg-white border-2 border-emerald-200 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
>
  <Heart className="w-9 h-9 text-emerald-500" fill="currentColor" />
</button>
  </div>
)}

      {isChatOpen && (
        <ChatModal
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          onSendMessage={handleSendMessage}
          chatInput={chatInput}
          setChatInput={setChatInput}
        />
      )}

    </div>
  );
}