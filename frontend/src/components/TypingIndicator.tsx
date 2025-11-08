import { useEffect, useState } from "react";

interface TypingIndicatorProps {
  typingUserNames: string[];
  className?: string;
}

export const TypingIndicator = ({ typingUserNames, className = "" }: TypingIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Fade in/out animation
  useEffect(() => {
    if (typingUserNames.length > 0) {
      // Small delay for fade-in animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [typingUserNames.length]);

  if (typingUserNames.length === 0) {
    return null;
  }

  // Format the typing text based on number of users
  const getTypingText = () => {
    if (typingUserNames.length === 1) {
      return `${typingUserNames[0]} is typing`;
    } else if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing`;
    } else if (typingUserNames.length === 3) {
      return `${typingUserNames[0]}, ${typingUserNames[1]}, and ${typingUserNames[2]} are typing`;
    } else {
      // 4+ users
      return `${typingUserNames[0]}, ${typingUserNames[1]}, and ${typingUserNames.length - 2} others are typing`;
    }
  };

  return (
    <div
      className={`flex items-start mb-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <div className="max-w-[70%] bg-gray-100 rounded-2xl px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-gray-600">{getTypingText()}</span>
          <div className="flex items-center gap-1 ml-1">
            <TypingDot delay={0} />
            <TypingDot delay={150} />
            <TypingDot delay={300} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated typing dot component
const TypingDot = ({ delay }: { delay: number }) => {
  return (
    <div
      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
      style={{
        animationDuration: "1.4s",
        animationDelay: `${delay}ms`,
        animationIterationCount: "infinite",
      }}
    />
  );
};
