import { useState } from "react";
import DateSelector from "./DateSelector";
import axios from "axios";
import "../index.css";

function PredictionForm({ onPrediction }) {
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(new Date().getHours());
  const [temperature, setTemperature] = useState(23.5);
  const [humidity, setHumidity] = useState(60);
  const [windSpeed, setWindSpeed] = useState(1.8);
  const [rainfall, setRainfall] = useState(0.0);
  const [snowfall, setSnowfall] = useState(0.0);
  const [visibility, setVisibility] = useState(2000);
  const [solar, setSolar] = useState(0.3);
  const [dewPoint, setDewPoint] = useState(15.2);
  const [season, setSeason] = useState("Summer");
  const [holiday, setHoliday] = useState(0);
  const [autoFilled, setAutoFilled] = useState(false);

  const handleWeatherFetch = (weather) => {
    setTemperature(weather.temperature);
    setHumidity(weather.humidity);
    setWindSpeed(weather.windSpeed);
    setRainfall(weather.rainfall);
    setSnowfall(weather.snowfall);
    setVisibility(weather.visibility);
    setSolar(weather.solar);
    setDewPoint(weather.dewPoint);
    setHour(new Date().getHours());
    setAutoFilled(true);
    setTimeout(() => setAutoFilled(false), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = date.toISOString().slice(0, 10);

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
      console.log("input DATA:", inputData);
      console.log("예측 결과:", res.data);
    } catch (err) {
      console.error("예측 요청 오류:", err);
    }
  };

  const inputField = (label, value, setter) => (
    <div className="input-group">
      <label>{label}</label>
      <input
        className={`weather-input ${autoFilled ? "highlight" : ""}`}
        type="number"
        value={value}
        onChange={(e) => setter(+e.target.value)}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="prediction-form">
      <DateSelector
        onDateSelect={setDate}
        onWeatherFetch={handleWeatherFetch}
      />

      {inputField("시간", hour, setHour)}
      {inputField("기온", temperature, setTemperature)}
      {inputField("습도", humidity, setHumidity)}
      {inputField("풍속", windSpeed, setWindSpeed)}
      {inputField("가시거리", visibility, setVisibility)}
      {inputField("강수량", rainfall, setRainfall)}
      {inputField("적설량", snowfall, setSnowfall)}
      {inputField("일사량", solar, setSolar)}
      {inputField("이슬점 온도", dewPoint, setDewPoint)}

      <div className="input-group">
        <label>계절</label>
        <select
          className="weather-input"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        >
          <option value="Spring">봄</option>
          <option value="Summer">여름</option>
          <option value="Autumn">가을</option>
          <option value="Winter">겨울</option>
        </select>
      </div>

      <div className="input-group">
        <label>공휴일</label>
        <select
          className="weather-input"
          value={holiday}
          onChange={(e) => setHoliday(+e.target.value)}
        >
          <option value={0}>아니오</option>
          <option value={1}>예</option>
        </select>
      </div>

      <button type="submit" className="submit-button">
        예측
      </button>
    </form>
  );
}

export default PredictionForm;
