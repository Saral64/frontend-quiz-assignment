"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

// --- DATA ---
const questions = [
  { id: 1, question: "What sound does a cat make?", options: ["Bhau-Bhau", "Meow-Meow", "Oink-Oink"], answer: "Meow-Meow" },
  { id: 2, question: "What would you probably find in your fridge?", options: ["Shoes", "Ice Cream", "Books"], answer: "Ice Cream" },
  { id: 3, question: "How many stars are in the sky?", options: ["Two", "Infinite", "One Hundred"], answer: "Infinite" },
  { id: 4, question: "What color are bananas?", options: ["Blue", "Yellow", "Red"], answer: "Yellow" }
];

// --- COMPONENT: ANIMATED COUNTER (0% -> 62%) ---
function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest) + "%");

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

// --- MAIN COMPONENT ---
export default function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const isLastQ = currentIndex === questions.length - 1;

  // Animation Variants for Content Switching
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 50 : -50, opacity: 0 }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(currentIndex + newDirection);
  };

  const getScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) score++;
    });
    return Math.round((score / questions.length) * 100);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#BECFEE] via-[#71C6E2] to-[#D9F4FA] p-8 md:p-16 font-lato overflow-hidden">
      
      {/* OUTER GLASS CONTAINER */}
      <div className="relative w-full max-w-[1700px] min-h-[920px] rounded-[50px] border-[2px] border-white/50 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-[4px] p-[60px] flex items-center justify-center shadow-2xl transition-all duration-500">
        
        {/* INNER SOLID CARD */}
        <motion.div 
            layout 
            className="bg-[#F4FDFF] w-full h-full rounded-[42px] shadow-lg relative flex flex-col items-center justify-center transition-all duration-500 min-h-[856px] p-8 md:p-12 overflow-hidden"
        >
            
            <AnimatePresence mode="wait">
            
            {/* --- VIEW 1: QUIZ --- */}
            {!isFinished ? (
                <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center relative z-10"
                >
                    {/* Header Section */}
                    <div className="text-center mb-10 mt-4 flex flex-col items-center w-full">
                        <h1 className="text-5xl md:text-[90px] leading-tight font-serif italic mb-6 bg-gradient-to-r from-[#15313D] to-[#3CABDA] bg-clip-text text-transparent pb-4 tracking-[-4px]">
                            Test Your Knowledge
                        </h1>
                        
                        <div className="w-full max-w-[422px] h-[45px] bg-white rounded-[8px] flex items-center justify-center shadow-sm mb-8">
                            <p className="text-[#15313D] text-sm font-medium font-sans">
                                Answer all questions to see your results
                            </p>
                        </div>

                        <div className="flex gap-4 w-full max-w-[600px]">
                            {questions.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-2.5 flex-1 rounded-full transition-colors duration-500 ${
                                        idx <= currentIndex ? 'bg-[#15313D]' : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Animated Question Content */}
                    <div className="w-full max-w-[896px] relative min-h-[400px]">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                                className="w-full absolute top-0 left-0"
                            >
                                {/* Blue Gradient Question Box */}
                                <div className="w-full min-h-[78px] bg-gradient-to-r from-[#C6E9F7] to-[#E5F8FF] border border-[#96E5FF] rounded-[10px] flex items-center justify-center mb-8 px-4 shadow-sm mx-auto">
                                    <h2 className="text-xl md:text-2xl font-bold text-[#15313D] text-center">
                                        {currentQ.id}. {currentQ.question}
                                    </h2>
                                </div>

                                <div className="space-y-4 mx-auto max-w-[800px]">
                                    {currentQ.options.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => setSelectedAnswers({...selectedAnswers, [currentIndex]: option})}
                                            // UPDATED: When selected, apply the Question Box Gradient Style (#C6E9F7 -> #E5F8FF)
                                            className={`w-full p-5 rounded-[10px] text-center font-bold text-lg transition-all duration-200 border-2
                                                ${selectedAnswers[currentIndex] === option 
                                                    ? 'bg-gradient-to-r from-[#C6E9F7] to-[#E5F8FF] border-[#96E5FF] text-[#15313D] shadow-md scale-[1.02]' 
                                                    : 'border-transparent bg-[#F4FDFF] hover:bg-white hover:shadow-sm text-gray-600'
                                                }`}
                                            style={selectedAnswers[currentIndex] !== option ? { boxShadow: "0px 4px 14px 0px rgba(0, 0, 0, 0.05)" } : {}}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="absolute top-[600px] right-[50px] flex gap-4 z-30">
                        <button 
                            onClick={() => paginate(-1)}
                            disabled={currentIndex === 0}
                            className={`w-[50px] h-[50px] flex items-center justify-center rounded-lg transition-colors ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-[#C6E9F7] text-[#15313D] hover:bg-[#96E5FF]'}`}
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <button 
                            onClick={() => { if (isLastQ) setIsFinished(true); else paginate(1); }}
                            className="bg-[#C6E9F7] text-[#15313D] hover:bg-[#96E5FF] h-[50px] px-6 rounded-lg font-bold transition-colors shadow-sm flex items-center justify-center min-w-[50px]"
                        >
                            {isLastQ ? "Submit" : <ArrowRight size={24} />}
                        </button>
                    </div>

                    {/* DECOR ELEMENTS */}
                    <AnimatePresence>
                        {currentIndex === 0 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                                className="absolute top-[580px] left-[40px] hidden md:block font-handwriting z-20 pointer-events-none"
                            >
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-[140px] left-[-30px] w-[196px] h-[96px]"
                                >
                                    <img src="/speech-bubble.png" alt="Best of Luck" className="w-full h-full object-contain drop-shadow-sm" />
                                </motion.div>
                                <div className="w-[173px] h-[173px] relative z-10">
                                    <img src="/paw.gif" alt="Cat Paw" className="w-full h-full object-contain" /> 
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>

            ) : (
                
                /* --- VIEW 2: RESULT --- */
                <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center flex flex-col items-center justify-center w-full h-full"
                >
                    <div className="bg-white px-6 py-2 rounded-full shadow-sm text-[#15313D] font-bold text-sm mb-8 tracking-wider">
                        Keep Learning!
                    </div>

                    <h2 className="text-5xl md:text-[60px] font-serif italic mb-4 bg-gradient-to-r from-[#15313D] to-[#3CABDA] bg-clip-text text-transparent pb-4">
                        Your Final score is
                    </h2>

                    <div className="text-[120px] leading-none font-serif text-[#15313D] my-6">
                        <AnimatedCounter value={getScore()} />
                    </div>
                    
                    <button 
                        onClick={() => { setIsFinished(false); setCurrentIndex(0); setSelectedAnswers({}); }}
                        className="bg-[#C6E9F7] text-[#15313D] px-12 py-4 rounded-xl font-bold hover:bg-[#96E5FF] transition border border-[#96E5FF] text-lg mt-8"
                    >
                        Start Again
                    </button>
                </motion.div>
            )}

            </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}