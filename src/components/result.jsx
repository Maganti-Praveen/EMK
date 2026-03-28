import "./css/result.css";

const Result = ({ username, earned, won, onPlayAgain }) => {
  const storedUsername = localStorage.getItem("username");
  const displayName = username || storedUsername || "User";
  const heading = won
    ? `Congratulations ${displayName}!`
    : `${displayName}, better luck next time!`;
  const summary = won
    ? `You completed the full quiz and won ${earned}.`
    : `You earned ${earned}.`;

  return (
    <div className="resultpage">
      <div className={`resultbox ${won ? "resultbox-win" : "resultbox-lose"}`}>
        <h1 className="text">{heading}</h1>
        <p className="summary">{summary}</p>
        <button onClick={onPlayAgain} className="btn" > Play again </button>
      </div>
    </div>
  );
};

export default Result;