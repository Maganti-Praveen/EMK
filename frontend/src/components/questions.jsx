import  { useState } from "react";
import "./css/questions.css";

const Questions = ({
data,
  setquestionnumber,
  setIsAnswerCorrect,
  onEnd,
  isTimeUp,
}) => {
  const [selected, setSelected] = useState(null);
  const [answerStatus, setAnswerStatus] = useState("");

  const handleAnswerClick = (index) => {
    if (isTimeUp || selected !== null) return;

    setSelected(index);
    const isCorrect = index === data.correct;
    setAnswerStatus(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      if (isCorrect) {
        setIsAnswerCorrect(true);
        setquestionnumber((prev) => prev + 1);
        setSelected(null);
        setAnswerStatus("");
      } else {
        onEnd();
      }
    }, 1000);
  };

  return (
    <div className="questionbox">
      <div className="question">{data.text}</div>
      <div className="options">
        {data.options.map((opt, i) => (
          <button key={i} className={`answer-option ${selected === i? answerStatus === "correct" ? "correctanswer" : "wronganswer" : "" }`} 
          onClick={() => handleAnswerClick(i)} > {opt} </button> ))}
      </div>
      {isTimeUp && <div className="timeup">⏱ Time’s up!</div>}
    </div>
  );
};

export default Questions;
