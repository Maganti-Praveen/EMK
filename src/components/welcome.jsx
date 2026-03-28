import { useState } from "react";
import "./css/welcome.css";

const Welcome = ({ onStart }) => {
  const [username, setusername] = useState("");

  const handleStart = () => {
    if (username.trim() !== "") {
      onStart(username);
      localStorage.setItem("username", username);
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div className="mainbox">
      <input className="ip" placeholder="Enter your name" onChange={(e) => setusername(e.target.value)}/>
      <button className="btn" onClick={handleStart}>Let's Goo</button>
    </div>
  );
};

export default Welcome;