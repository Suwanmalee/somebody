export default function MessageBubble({ message }) {
  const { text, sender } = message;
  const isUser = sender === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl shadow ${
          isUser
            ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-br-none'
            : 'bg-white/10 text-violet-100 rounded-bl-none'
        }`}
      >
        {text}
      </div>
    </div>
  );
}

