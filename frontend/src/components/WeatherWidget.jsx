function WeatherWidget({ weather, hour, onHourChange }) {
  if (!weather) return null;

  const formatHour = (hour) => {
    const h = Number(hour);
    if (isNaN(h)) return "";
    const suffix = h >= 12 ? "P.M." : "A.M.";
    const formatted = h % 12 === 0 ? 12 : h % 12;
    return `${formatted} ${suffix}`;
  };

  const iconEmojiMap = {
    "01d": "☀️",
    "01n": "🌕",
    "02d": "🌤",
    "02n": "☁️",
    "03d": "⛅️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧",
    "09n": "🌧",
    "10d": "🌦",
    "10n": "🌧",
    "11d": "🌩",
    "11n": "🌩",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫",
    "50n": "🌫",
  };

  const icon = iconEmojiMap[weather.weatherIcon] || "❓"; // fallback

  return (
    <div className="weather-card">
      <div className="weather-header">☁️ Gunja-Dong Weather</div>
      <div className="weather-condition">{weather.weatherCondition}</div>

      <div className="weather-main-row">
        <div className="temp-icon">{icon}</div>
        <div className="temp-value">{Math.round(weather.temperature)}°</div>
      </div>

      <div className="weather-info">
        <div>
          Feels like <strong>{Math.round(weather.temperature)}°</strong>
        </div>
        <div>
          Humidity <strong>{weather.humidity}</strong>
        </div>
        <div>
          Wind <strong>{weather.windSpeed} Km/h</strong>
        </div>
        <div>
          Visibility <strong>{weather.visibility} m</strong>
        </div>
        <div>
          Snow <strong>{weather.snowfall} cm</strong>
        </div>
        <div>
          Recent Rain <strong>{weather.rainfall} mm</strong>
        </div>
      </div>

      <div className="weather-time-select">
        <label>
          Time{" "}
          <input
            className="weather-time-input"
            type="number"
            min="0"
            max="23"
            value={hour}
            onChange={(e) => onHourChange(+e.target.value)}
          />
        </label>
        <span className="time-tag">{formatHour(hour)}</span>
      </div>
    </div>
  );
}

export default WeatherWidget;
