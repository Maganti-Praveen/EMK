import { useEffect, useState } from "react";
import Questions from "./questions";
import Score from "./score";
import Timer from "./timer";
import questions from "../data/questions";
import Result from "./result";
import "./css/quiz.css";
import bgm from "/audio.mp3"

const Quiz = () => {
  const [questionnumber, setquestionnumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [earned, setEarned] = useState("₹ 0");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [gameover, setgameover] = useState(false);
  const array = [
    { id: 1, amount: "₹ 100" },
    { id: 2, amount: "₹ 200" },
    { id: 3, amount: "₹ 300" },
    { id: 4, amount: "₹ 500" },
    { id: 5, amount: "₹ 1,000" },
    { id: 6, amount: "₹ 2,000" },
    { id: 7, amount: "₹ 4,000" },
    { id: 8, amount: "₹ 8,000" },
    { id: 9, amount: "₹ 16,000" },
    { id: 10, amount: "₹ 32,000" },
    { id: 11, amount: "₹ 64,000" },
    { id: 12, amount: "₹ 125,000" },
    { id: 13, amount: "₹ 250,000" },
    { id: 14, amount: "₹ 500,000" },
    { id: 15, amount: "₹ 1,000,000" },
  ].reverse();

  useEffect(() => {
    if (questionnumber > 1) {
      setEarned(array.find((level) => level.id === questionnumber - 1).amount);
    }
  }, [questionnumber]);

  useEffect( () => {
    const audio = new Audio(bgm);
    audio.loop = true;
    audio.play();

return () => {
  audio.pause();
  audio.currentTime = 0;
};

  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setgameover(true);
    }
  }, [timeLeft]);

  const restart = () => {
    setquestionnumber(1);
    setTimeLeft(30);
    setEarned("₹ 0");
    setIsAnswerCorrect(false);
    setgameover(false);
  };

  const handlewronganswer = () => {
    setgameover(true);
  };

  return (
  <div className="quizbody">
    <div className="quiz">
      {gameover ? ( <Result earned={earned} onPlayAgain={restart} /> ) : (
        <>
          <div className="top">
            <div className="timer">
              <Timer setTimeLeft={setTimeLeft} questionIndex={questionnumber} />
            </div>
          </div>
          <div className="bottom">
            <Questions
              data={questions[questionnumber - 1]}
              setquestionnumber={setquestionnumber}
              setIsAnswerCorrect={setIsAnswerCorrect}
              onEnd={handlewronganswer}
              isTimeUp={timeLeft === 0}
            />
          </div>
        </>
      )}
    </div>
    <Score array={array} questionnumber={questionnumber} />
  </div>
);

};

export default Quiz;
