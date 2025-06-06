import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";
import bikeLogoAnimation from "./assets/bike_logo.json";
import Lottie from "lottie-react";
import PredictionForm from "./components/PredictionForm";

function AnimatedLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Lottie animationData={bikeLogoAnimation} loop={true} />
    </motion.div>
  );
}

function App() {
  const [prediction, setPrediction] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div id="root">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <AnimatedLogo />
      </div>

      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginTop: "1rem",
        }}
      >
        자전거 대여 수요를 예측해보세요!
      </h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#aaa" }}>
        날씨와 시간에 따라 예측되는 수요를 확인해보세요
      </p>

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
