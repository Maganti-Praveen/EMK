import { useState } from "react";
import Quiz from "./components/quiz";
import Welcome from "./components/welcome";

const App = () => {
  const [username, setUsername] = useState(null);

  return (
    <div className="App">
      {!username ? ( <Welcome onStart={(name) => setUsername(name)} />) : (<Quiz username={username} />)}
    </div>
  );
};

export default App;