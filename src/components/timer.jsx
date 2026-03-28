import { useEffect, useState } from "react";
import "./css/timer.css";

const Timer = ({ setTimeLeft, questionIndex, isStopped }) => {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    setTimer(30);
  }, [questionIndex]);

  useEffect(() => {
    if (isStopped || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isStopped]);

  useEffect(() => {
    setTimeLeft(timer);
  }, [timer, setTimeLeft]);

  useEffect(() => {
    if (isStopped || timer <= 0 || timer > 5) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);

    oscillator.onended = () => {
      audioContext.close();
    };
  }, [timer, isStopped]);

  const urgencyClass = timer <= 5 ? "danger" : timer <= 10 ? "warning" : "normal";

  return (
    <div
      className={`timer-display ${urgencyClass}`}
      role="timer"
      aria-live="polite"
      aria-label={`${timer} seconds left`}
    >
      {timer}
    </div>
  );
};

export default Timer;
