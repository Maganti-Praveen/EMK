import "./css/result.css";

const Result = ({ earned, onPlayAgain }) => {
  const username = localStorage.getItem("username");
  return (
    <div className="resultpage">
      <div className="resultbox">
        <h1 className="text">
          {username ? username : "User"}, you earned <span className="text-yellow-400"> {earned}</span>
        </h1>
        <button onClick={onPlayAgain} className="btn" > Play again </button>
      </div>
    </div>
  );
};

export default Result;