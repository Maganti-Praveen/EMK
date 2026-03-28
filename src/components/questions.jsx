import { useEffect, useState } from "react";
import { resolveRound, validateQuestion } from "../utils/quizUtils";
import "./css/questions.css";

const Questions = ({
  data,
  setquestionnumber,
  onEnd,
  isTimeUp,
  questionnumber,
  totalQuestions,
}) => {
  const [selected, setSelected] = useState(null);
  const [answerStatus, setAnswerStatus] = useState("");

  useEffect(() => {
    setSelected(null);
    setAnswerStatus("");
  }, [data?.id]);

  if (!validateQuestion(data)) {
    return (
      <div className="questionbox" role="alert">
        <div className="question">This question is unavailable. Please continue.</div>
      </div>
    );
  }

  const handleAnswerClick = (index) => {
    if (isTimeUp || selected !== null) return;

    setSelected(index);
    const round = resolveRound({
      isCorrect: index === data.correct,
      isTimeUp,
      currentQuestion: questionnumber,
      totalQuestions,
    });

    setAnswerStatus(round.status === "wrong" ? "wrong" : "correct");

    setTimeout(() => {
      if (round.status === "continue" || round.status === "win") {
        setquestionnumber(round.nextQuestion);
        setSelected(null);
        setAnswerStatus("");
      } else {
        onEnd();
      }
    }, 1000);
  };

  return (
    <div className="questionbox" role="group" aria-label={`Question ${questionnumber} of ${totalQuestions}`}>
      <div className="question" id="current-question">{data.text}</div>
      <div className="options" role="list" aria-labelledby="current-question">
        {data.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            role="listitem"
            aria-label={`Option ${i + 1}: ${opt}`}
            aria-pressed={selected === i}
            className={`answer-option ${selected === i ? answerStatus === "correct" ? "correctanswer" : "wronganswer" : ""}`}
            disabled={isTimeUp || selected !== null}
            onClick={() => handleAnswerClick(i)}
          >
            {opt}
          </button>
        ))}
      </div>
      {isTimeUp && <div className="timeup" aria-live="assertive">Time's up!</div>}
    </div>
  );
};

export default Questions;
