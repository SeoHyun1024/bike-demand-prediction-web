import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

function PredictionForm({ onPrediction, date: selectedDate, weather, hour }) {
  const [autoFilled, setAutoFilled] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [rainfall, setRainfall] = useState(0);
  const [snowfall, setSnowfall] = useState(0);
  const [visibility, setVisibility] = useState(0);
  const [solar, setSolar] = useState(0);
  const [dewPoint, setDewPoint] = useState(0);
  const [season, setSeason] = useState("Summer");
  const [holiday, setHoliday] = useState(0);

  useEffect(() => {
    if (weather) {
      setTemperature(weather.temperature);
      setHumidity(weather.humidity);
      setWindSpeed(weather.windSpeed);
      setRainfall(weather.rainfall);
      setSnowfall(weather.snowfall);
      setVisibility(weather.visibility);
      setSolar(weather.solar);
      setDewPoint(weather.dewPoint);
      setAutoFilled(true);
      setTimeout(() => setAutoFilled(false), 1500);
    }
  }, [weather]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = selectedDate.toISOString().slice(0, 10);

    const inputData = {
      Date: formattedDate,
      Hour: hour,
      Temperature: temperature,
      Humidity: humidity,
      Wind_speed: windSpeed,
      Rainfall: rainfall,
      Snowfall: snowfall,
      Visibility: visibility,
      Solar_Radiation: solar,
      Dew_Point_Temp: dewPoint,
      Seasons: season,
      Holiday: holiday,
    };

    try {
      const res = await axios.post("/api/predict", inputData);
      onPrediction(res.data.prediction);
      setPrediction(res.data.prediction);

      console.log("예측 input:", inputData);
    } catch (err) {
      console.error("예측 요청 오류:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="prediction-form">
      <button type="submit" className="submit-button">
        예측하기 →
      </button>
      {prediction !== null && (
        <p className="prediction-result" style={{ marginTop: "1rem" }}>
          🚲 예상 대여 수요: <strong>{prediction}</strong> 대
        </p>
      )}
    </form>
  );
}

export default PredictionForm;
