import React, { useState, useRef, useMemo, useEffect } from 'react';
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

const DUMMY_HAMSTERS = [
  {
    id: 1,
    name: 'Pip',
    age: 1,
    bio: 'Just a little guy looking for treats and wheel-running buddies. Swipe right for sunflower seeds!',
    img: 'https://www.petakids.com/wp-content/uploads/2016/10/Brown-Hamster.jpg',
  },
  {
    id: 2,
    name: 'Squeaky',
    age: 2,
    bio: 'Professional napper and expert burrower. My cheeks can hold at least 3 peanuts. Impressed?',
    img: 'https://ca-times.brightspotcdn.com/dims4/default/9100bea/2147483647/strip/true/crop/873x576+0+0/resize/1200x792!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F26%2F3c%2F2442346d4041816f00387feb7bcb%2Fchild-with-cute-hamster.jpg',
  },
  {
    id: 3,
    name: 'General Fluff',
    age: 1,
    bio: 'Looking for a co-commander for my cardboard tank. Must enjoy spinach and plotting world domination (of the treat jar).',
    img: 'https://pet-health-content-media.chewy.com/wp-content/uploads/2025/04/16220031/202504bec-202409hamster-1024x615.jpg',
  },
  {
    id: 4,
    name: 'Nibbles',
    age: 1,
    bio: 'Swipe left... swipe right... is this thing edible? Oh, hi. I like broccoli. And sleeping. Mostly sleeping.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoDfZgvBrwGWqMrGpCRaMIfzvzkUl79WlnyH_54yWyMDJrlW9WF_w2PBIKbJWsepiu3vk&usqp=CAUhttps://www.humaneworld.org/sites/default/files/styles/responsive_3_4_500w/public/2021-06/hamster-540188.jpg.webp?itok=C1joOtzB',
  },
];

// --- Constants ---
const SWIPE_THRESHOLD = 120; // ระยะ px ที่ต้องปัดเพื่อ trigger
const SWIPE_OUT_DURATION = 300; // 300ms

// --- (เพิ่มใหม่) ข้อความสุ่มจากแฮมสเตอร์ ---
const HAMSTER_REPLIES = [
  "Squeak! Squeaky-squeak?",
  "*(เสียงวิ่งในวงล้อ)*",
  "Got any sunflower seeds?",
  "Zzz... *(กำลังงีบ)*",
  "My cheeks are full, talk later.",
  "Nibble nibble...",
  "Did you say... 'treat'?",
  "*(เสียงขุดที่นอน)*",
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
        <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <img
            src={hamster.img}
            alt={hamster.name}
            className="w-full h-3/4 object-cover"
            draggable="false"
          />
          <div className="p-5 absolute bottom-0 left-0 right-0 h-1/4 bg-white">
            <h2 className="text-2xl font-bold text-gray-800">
              {hamster.name}, {hamster.age}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">{hamster.bio}</p>
          </div>

          <div
            className={`absolute top-10 left-10 text-4xl font-bold text-green-500 border-4 border-green-500 px-4 py-2 rounded-lg transform -rotate-20 ${
              positionRef.current.x > SWIPE_THRESHOLD / 3 ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-200`}
            style={{ opacity: positionRef.current.x / (SWIPE_THRESHOLD / 2) }}
          >
            ชอบเลย
          </div>
          <div
            className={`absolute top-10 right-10 text-4xl font-bold text-red-500 border-4 border-red-500 px-4 py-2 rounded-lg transform rotate-20 ${
              positionRef.current.x < -SWIPE_THRESHOLD / 3 ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-200`}
            style={{ opacity: -positionRef.current.x / (SWIPE_THRESHOLD / 2) }}
          >
            อาจจะยัง
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
    <div className="font-inter flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-200 p-4 overflow-hidden">
      
      <div className="flex items-center text-gray-700 mb-4">
        <PawPrint className="w-8 h-8 mr-2 text-orange-600" /> {/* ใช้ Lucide PawPrint */}
        <h1 className="text-3xl font-bold tracking-tighter">Hamster</h1>
      </div>


      <div className="relative w-full max-w-sm h-[550px] md:h-[600px]">
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
          <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">No more hamsters!</h2>
            <p className="text-gray-600 mt-2">You've seen all the cute hamsters for now. Check back later!</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={resetDeck}
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCcw size={20} />
                กลับไปเริ่มใหม่
              </button>
              <button
                onClick={() => setIsChatOpen(true)} // (เพิ่มใหม่) เปิด Chat
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessagesSquare size={20} />
                คุยกับ Hamster
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Action Buttons */}
      {/* ... (Action Buttons เหมือนเดิม) */}
      {cardsToShow.length > 0 && (
        <div className="flex justify-center items-center gap-5 mt-6 w-full max-w-sm">
          {/* Nope Button (X) */}
          <button
            onClick={handleNopeClick}
            className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-xl transform transition-transform duration-200 hover:scale-110 active:scale-95"
            aria-label="อาจจะยัง"
          >
            <X className="w-8 h-8 text-red-500" strokeWidth={3} /> {/* ใช้ Lucide X */}
          </button>

          {/* Boost Button (Lightning) */}
          <button
            onClick={handleBoostClick}
            className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-xl transform transition-transform duration-200 hover:scale-110 active:scale-95"
            aria-label="ชอบเลย"
          >
            <Zap className="w-7 h-7 text-purple-500" fill="currentColor" /> 
          </button>

          {/* Like Button (Heart) */}
          <button
            onClick={handleLikeClick}
            className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-xl transform transition-transform duration-200 hover:scale-110 active:scale-95"
            aria-label="ชอบมาก"
          >
            <Heart className="w-9 h-9 text-green-500" fill="currentColor" /> 
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