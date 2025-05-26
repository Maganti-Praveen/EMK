import React, { useEffect, useState } from "react";
import "./css/timer.css";


const Timer = ({ setTimeLeft, questionIndex }) => {
  const [timer, setTimer] = useState(30);

   useEffect(() => {
    setTimer(30);
  }, [questionIndex]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    setTimeLeft(timer);
  }, [timer, setTimeLeft]);

  return <div className="timer-display">{timer}</div>;
};

export default Timer;
