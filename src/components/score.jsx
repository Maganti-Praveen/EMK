import "./css/score.css";

const Score = ({ array, questionnumber }) => {
  return (
    <div className="right">
      <ul className="array">
        {array.map((m) => (
          <li key={m.id} className={ questionnumber === m.id ? "itemactive" : "item" } >
            <span className="id">{m.id}</span>
            <span className="amount">{m.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Score;
