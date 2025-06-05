import { useState } from "react";
import PredictionForm from "./components/PredictionForm";

function App() {
  const [prediction, setPrediction] = useState(null);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🚲 자전거 대여 수요 예측기</h1>
      <PredictionForm onResult={setPrediction} />
      {prediction !== null && (
        <p>
          🔮 예측 대여 수요: <strong>{prediction}</strong> 대
        </p>
      )}
    </div>
  );
}

export default App;
