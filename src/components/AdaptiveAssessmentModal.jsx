import React, { useState } from "react";
import { 
  Sparkles, 
  Award, 
  Brain, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function AdaptiveAssessmentModal({ isOpen, onClose, skillTopic = "Backend", initialDifficulty = 0.5 }) {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [resultsHistory, setResultsHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [preScore, setPreScore] = useState(initialDifficulty);
  const [postScore, setPostScore] = useState(initialDifficulty);

  // Load question when index or difficulty changes
  React.useEffect(() => {
    if (isOpen && !isFinished) {
      fetchQuestion(currentDifficulty);
    }
  }, [isOpen, currentDifficulty, currentQuestionIndex]);

  const fetchQuestion = async (diff) => {
    setLoading(true);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    try {
      const res = await fetch("/api/ai/adaptive-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillTopic, currentDifficulty: diff })
      });
      const data = await res.json();
      setQuestionData(data);
    } catch (err) {
      console.error("Error fetching adaptive question:", err);
      setQuestionData({
        question: `What is the core principle of optimizing ${skillTopic} scalability under high concurrency?`,
        options: [
          "Employing asynchronous non-blocking I/O and caching layers",
          "Hardcoding synchronous sleep timers",
          "Using monolithic shared memory without indexes",
          "Disabling database replication entirely"
        ],
        correctIndex: 0,
        difficulty: diff
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !questionData) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === questionData.correctIndex;
    const newHistoryItem = {
      question: questionData.question,
      difficulty: currentDifficulty,
      correct: isCorrect
    };
    const updatedHistory = [...resultsHistory, newHistoryItem];
    setResultsHistory(updatedHistory);

    // Adaptivity logic: Correct -> current + 0.15 (cap 1.0), Incorrect -> current - 0.15 (floor 0.0)
    let nextDiff = currentDifficulty;
    if (isCorrect) {
      nextDiff = Math.min(1.0, Number((currentDifficulty + 0.15).toFixed(2)));
    } else {
      nextDiff = Math.max(0.0, Number((currentDifficulty - 0.15).toFixed(2)));
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 >= 5) {
        // Finish quiz after 5 questions
        finalizeQuiz(updatedHistory);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setCurrentDifficulty(nextDiff);
      }
    }, 1500);
  };

  const finalizeQuiz = (history) => {
    setIsFinished(true);
    const correctItems = history.filter((h) => h.correct);
    const avgScore = correctItems.length > 0 
      ? correctItems.reduce((acc, curr) => acc + curr.difficulty, 0) / correctItems.length
      : Math.max(0.2, preScore - 0.1);

    const finalCalculated = Number(avgScore.toFixed(2));
    setPostScore(finalCalculated);

    // Update Firestore / profile competency graph
    try {
      const storedUser = JSON.parse(localStorage.getItem("skillsmap_active_user") || "{}");
      if (storedUser && storedUser.id) {
        let graph = storedUser.competencyGraph || [
          { skill: "Backend", level: 0.5 },
          { skill: "Frontend", level: 0.5 },
          { skill: "Architecture", level: 0.5 },
          { skill: "Problem Solving", level: 0.5 },
          { skill: "Database", level: 0.5 },
          { skill: "DevOps", level: 0.5 }
        ];

        const existingIdx = graph.findIndex((g) => g.skill.toLowerCase() === skillTopic.toLowerCase());
        if (existingIdx !== -1) {
          graph[existingIdx].level = finalCalculated;
        } else {
          graph.push({ skill: skillTopic, level: finalCalculated });
        }

        storedUser.competencyGraph = graph;
        localStorage.setItem("skillsmap_active_user", JSON.stringify(storedUser));
      }
    } catch {}

    toast({
      title: "Adaptive Assessment Completed!",
      description: `Calibrated competency score updated for ${skillTopic}.`
    });
  };

  if (!isOpen) return null;

  const delta = Number((postScore - preScore).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Adaptive Assessment: {skillTopic}
              </h3>
              <p className="text-xs text-slate-400">Difficulty dynamically adjusts based on your answers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!isFinished ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Question {currentQuestionIndex + 1} of 5</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Difficulty Level: {Math.round(currentDifficulty * 100)}%
              </span>
            </div>

            {loading || !questionData ? (
              <div className="py-16 text-center space-y-3">
                <Sparkles className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Generating next adaptive question via Gemini AI...</p>
              </div>
            ) : (
              <div className="space-y-5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {questionData.question}
                </h4>

                <div className="space-y-2.5">
                  {questionData.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === questionData.correctIndex;
                    let btnStyle = "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";

                    if (isAnswerSubmitted) {
                      if (isCorrect) btnStyle = "bg-emerald-500 text-white border-emerald-500";
                      else if (isSelected && !isCorrect) btnStyle = "bg-rose-500 text-white border-rose-500";
                    } else if (isSelected) {
                      btnStyle = "bg-indigo-600 text-white border-indigo-600 shadow-sm";
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={cn(
                          "w-full p-3.5 rounded-2xl text-left text-xs font-semibold border transition-all cursor-pointer",
                          btnStyle
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null || isAnswerSubmitted}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 text-center py-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <Award className="h-7 w-7" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Assessment Completed Successfully!</h4>
              <p className="text-xs text-slate-400 mt-1">Competency score updated for {skillTopic}</p>
            </div>

            {/* Delta badge */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-around">
              <div>
                <p className="text-[11px] text-slate-400">Previous Level</p>
                <p className="text-base font-bold text-slate-700 dark:text-slate-300">{Math.round(preScore * 100)}%</p>
              </div>
              <ArrowRight className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-[11px] text-slate-400">Calibrated Level</p>
                <p className="text-base font-extrabold text-emerald-600">{Math.round(postScore * 100)}%</p>
              </div>
              <div className={cn("px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1", delta >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800")}>
                {delta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{delta >= 0 ? `+${Math.round(delta * 100)}% ▲` : `${Math.round(delta * 100)}% ▼`}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Done & Return to Roadmap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
