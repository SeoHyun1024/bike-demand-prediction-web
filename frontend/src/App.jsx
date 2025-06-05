// App.jsx
import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import logoGif from "./assets/bike_animation.gif"; // 새로 추가한 GIF
import PredictionForm from "./components/PredictionForm";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

function App() {
  const [prediction, setPrediction] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div id="root">
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <img src={logoGif} className="logo" alt="Animated Logo" />
      </div>

      <div className="card">
        <PredictionForm
          onPrediction={setPrediction}
          setSelectedDate={setSelectedDate}
        />
        {prediction !== null && (
          <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
            🔮 예상 대여 수요: <strong>{prediction}</strong> 대
          </p>
        )}
      </div>

      <p className="read-the-docs">Project by – 2025</p>
    </div>
  );
}

export default App;
