import { useState } from "react";
import DateSelector from "./DateSelector";
import axios from "axios";

function PredictionForm({ onPrediction }) {
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(14);
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

  // ✅ 날씨 데이터 수신 시 업데이트
  const handleWeatherFetch = ({ temperature, humidity, windSpeed }) => {
    setTemperature(temperature);
    setHumidity(humidity);
    setWindSpeed(windSpeed);
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
    } catch (err) {
      console.error("예측 요청 오류:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DateSelector
        onDateSelect={setDate}
        onWeatherFetch={({ temperature, humidity, windSpeed }) => {
          setTemperature(temperature);
          setHumidity(humidity);
          setWindSpeed(windSpeed);
        }}
      />

      <div>
        시간:{" "}
        <input
          type="number"
          value={hour}
          onChange={(e) => setHour(+e.target.value)}
        />
      </div>
      <div>
        기온:{" "}
        <input
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(+e.target.value)}
        />
      </div>
      <div>
        습도:{" "}
        <input
          type="number"
          value={humidity}
          onChange={(e) => setHumidity(+e.target.value)}
        />
      </div>
      <div>
        풍속:{" "}
        <input
          type="number"
          value={windSpeed}
          onChange={(e) => setWindSpeed(+e.target.value)}
        />
      </div>
      <div>
        가시거리:{" "}
        <input
          type="number"
          value={visibility}
          onChange={(e) => setVisibility(+e.target.value)}
        />
      </div>
      <div>
        강수량:{" "}
        <input
          type="number"
          value={rainfall}
          onChange={(e) => setRainfall(+e.target.value)}
        />
      </div>
      <div>
        적설량:{" "}
        <input
          type="number"
          value={snowfall}
          onChange={(e) => setSnowfall(+e.target.value)}
        />
      </div>
      <div>
        일사량:{" "}
        <input
          type="number"
          value={solar}
          onChange={(e) => setSolar(+e.target.value)}
        />
      </div>
      <div>
        이슬점 온도:{" "}
        <input
          type="number"
          value={dewPoint}
          onChange={(e) => setDewPoint(+e.target.value)}
        />
      </div>
      <div>
        계절:
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="Spring">봄</option>
          <option value="Summer">여름</option>
          <option value="Autumn">가을</option>
          <option value="Winter">겨울</option>
        </select>
      </div>
      <div>
        공휴일:
        <select value={holiday} onChange={(e) => setHoliday(+e.target.value)}>
          <option value={0}>아니오</option>
          <option value={1}>예</option>
        </select>
      </div>
      <button type="submit">예측</button>
    </form>
  );
}

export default PredictionForm;
