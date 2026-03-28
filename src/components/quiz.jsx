import { useEffect, useState } from "react";
import Questions from "./questions";
import Score from "./score";
import Timer from "./timer";
import questions from "../data/questions";
import Result from "./result";
import {
  createQuestionSet,
  getEarnedAmount,
  isValidStoredGameState,
  QUIZ_PROGRESS_KEY,
} from "../utils/quizUtils";
import "./css/quiz.css";
import bgm from "/audio.mp3"

const prizeLevels = [
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

const Quiz = ({ username }) => {
  const [roundQuestions, setRoundQuestions] = useState(() => createQuestionSet(questions));
  const [questionnumber, setquestionnumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [earned, setEarned] = useState("₹ 0");
  const [gameover, setgameover] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!savedProgress) return;

    try {
      const parsed = JSON.parse(savedProgress);
      if (isValidStoredGameState(parsed, questions.length)) {
        setRoundQuestions(parsed.roundQuestions);
        setquestionnumber(parsed.questionnumber);
        setTimeLeft(parsed.timeLeft);
        setEarned(parsed.earned);
        setgameover(parsed.gameover);
        setHasWon(parsed.hasWon);
      } else {
        localStorage.removeItem(QUIZ_PROGRESS_KEY);
      }
    } catch {
      localStorage.removeItem(QUIZ_PROGRESS_KEY);
    }
  }, []);

  useEffect(() => {
    setEarned(getEarnedAmount(prizeLevels, questionnumber));
  }, [questionnumber]);

  useEffect( () => {
    const audio = new Audio(bgm);
    audio.loop = true;
    audio.play().catch(() => {});

return () => {
  audio.pause();
  audio.currentTime = 0;
};

  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !hasWon) {
      setgameover(true);
    }
  }, [timeLeft, hasWon]);

  useEffect(() => {
    if (roundQuestions.length > 0 && questionnumber > roundQuestions.length) {
      setHasWon(true);
      setgameover(true);
    }
  }, [questionnumber, roundQuestions.length]);

  useEffect(() => {
    const snapshot = {
      roundQuestions,
      questionnumber,
      timeLeft,
      earned,
      gameover,
      hasWon,
    };
    localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(snapshot));
  }, [roundQuestions, questionnumber, timeLeft, earned, gameover, hasWon]);

  const restart = () => {
    const nextRound = createQuestionSet(questions);
    setRoundQuestions(nextRound);
    setquestionnumber(1);
    setTimeLeft(30);
    setEarned("₹ 0");
    setgameover(false);
    setHasWon(false);
    localStorage.removeItem(QUIZ_PROGRESS_KEY);
  };

  const handlewronganswer = () => {
    setHasWon(false);
    setgameover(true);
  };

  const currentQuestion = roundQuestions[questionnumber - 1];

  if (roundQuestions.length === 0) {
    return (
      <div className="quizbody">
        <div className="quiz">
          <Result username={username} earned="₹ 0" won={false} onPlayAgain={restart} />
        </div>
      </div>
    );
  }

  return (
  <div className="quizbody">
    <div className="quiz">
      {gameover || hasWon || questionnumber > roundQuestions.length ? (
        <Result username={username} earned={earned} won={hasWon} onPlayAgain={restart} />
      ) : (
        <>
          <div className="top">
            <div className="timer">
              <Timer
                setTimeLeft={setTimeLeft}
                questionIndex={questionnumber}
                isStopped={gameover || hasWon}
              />
            </div>
          </div>
          <div className="bottom">
            <Questions
              data={currentQuestion}
              setquestionnumber={setquestionnumber}
              onEnd={handlewronganswer}
              isTimeUp={timeLeft === 0}
              questionnumber={questionnumber}
              totalQuestions={roundQuestions.length}
            />
          </div>
        </>
      )}
    </div>
    <Score array={prizeLevels} questionnumber={questionnumber} />
  </div>
);

};

export default Quiz;
