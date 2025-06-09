import { useState } from "react";
import DateSelector from "./components/DateSelector";
import WeatherWidget from "./components/WeatherWidget"; // 날씨 카드 컴포넌트
import PredictionForm from "./components/PredictionForm";
import bikeLogoAnimation from "./assets/bike_logo.json";
import "./index.css";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

function AnimatedLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.8 }}
    >
      <Lottie animationData={bikeLogoAnimation} loop={true} />
    </motion.div>
  );
}

function App() {
  const [phase, setPhase] = useState("intro"); // intro | calendar | prediction
  const [selectedDate, setSelectedDate] = useState(null);
  const [weather, setWeather] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictionRequest, setPredictionRequest] = useState(false);
  const [hour, setHour] = useState(new Date().getHours());

  const handleHover = () => {
    if (phase === "intro") setPhase("calendar");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setPhase("prediction");
  };

  const handleWeatherFetch = (data) => {
    setWeather(data);
  };

  return (
    <div className="home-container">
      {phase !== "prediction" && (
        <div className="logo-wrapper">
          <AnimatedLogo />
        </div>
      )}

      <h2 className="main-title">자전거 대여 수요를 예측해보세요!</h2>
      <p className="sub-title">
        날씨와 시간에 따라 예측되는 수요를 확인해보세요
      </p>

      <div
        className={`date-display ${
          phase === "intro" ? "hoverable" : "selected"
        }`}
        onMouseEnter={handleHover}
      >
        {selectedDate
          ? selectedDate.toLocaleDateString("ko-KR")
          : new Date().toLocaleDateString("ko-KR")}
      </div>

      {phase !== "intro" && (
        <div className="calendar-section">
          <DateSelector
            onDateSelect={handleDateSelect}
            onWeatherFetch={handleWeatherFetch}
          />
        </div>
      )}

      {phase === "prediction" && (
        <>
          <WeatherWidget weather={weather} hour={hour} onHourChange={setHour} />
          <PredictionForm
            date={selectedDate}
            weather={weather}
            hour={hour}
            onPrediction={(value) => {
              setPrediction(value);
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
