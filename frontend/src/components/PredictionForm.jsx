import { useState } from "react";

function PredictionForm({ onResult }) {
  const [form, setForm] = useState({
    Date: "2025-06-11",
    Hour: 14,
    Temperature: 23.5,
    Humidity: 60,
    Wind_speed: 1.8,
    Rainfall: 0.0,
    Snowfall: 0.0,
    Visibility: 2000,
    Solar_Radiation: 0.3,
    Dew_Point_Temp: 15.2,
    Seasons: 2, // Autumn
    Holiday: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    onResult(data.prediction);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <label>{key}</label>
          <input name={key} value={value} onChange={handleChange} type="text" />
        </div>
      ))}
      <button type="submit">예측하기</button>
    </form>
  );
}

export default PredictionForm;
