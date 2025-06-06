import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import axios from "axios";
import { format } from "date-fns";
import "../index.css"; // 스타일 파일 추가

function DateSelector({ onDateSelect, onWeatherFetch }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [weatherCache, setWeatherCache] = useState({});
  const [forecast5, setForecast5] = useState([]);
  const [forecast16, setForecast16] = useState([]);
  const [location, setLocation] = useState({ lat: null, lon: null });

  const VITE_WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        console.warn("위치 정보를 가져오지 못했습니다:", err);
        setLocation({ lat: 37.5665, lon: 126.978 });
      }
    );
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchForecast5();
      fetchForecast16();
    }
  }, [location]);

  useEffect(() => {
    if (forecast5.length > 0 || forecast16.length > 0) {
      // mount 시점에 오늘 날짜에 해당하는 날씨 가져오기
      handleChange(new Date());
    }
  }, [forecast5, forecast16]);

  const fetchForecast5 = async () => {
    try {
      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast",
        {
          params: {
            lat: location.lat,
            lon: location.lon,
            units: "metric",
            appid: VITE_WEATHER_API_KEY,
          },
        }
      );
      console.log("5일 예보 데이터:", res.data);
      setForecast5(res.data.list);
    } catch (err) {
      console.error("5일 예보 API 요청 실패:", err);
    }
  };

  const fetchForecast16 = async () => {
    try {
      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast/daily",
        {
          params: {
            lat: location.lat,
            lon: location.lon,
            cnt: 16,
            units: "metric",
            appid: VITE_WEATHER_API_KEY,
          },
        }
      );
      console.log("16일 예보 데이터:", res.data);
      setForecast16(res.data.list);
    } catch (err) {
      console.error("16일 예보 API 요청 실패:", err);
    }
  };

  const handleChange = (date) => {
    setSelectedDate(date);
    setShowPicker(false);
    onDateSelect(date);

    const key = format(date, "yyyy-MM-dd");
    if (weatherCache[key]) {
      onWeatherFetch(weatherCache[key]);
      return;
    }

    const today = new Date();
    const daysDiff = Math.floor(
      (date.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 5) {
      const targetDateStr = format(date, "yyyy-MM-dd");
      const entry = forecast5.find((item) =>
        item.dt_txt?.includes(targetDateStr)
      );
      if (entry) {
        const weather = {
          temperature: entry.main.temp,
          humidity: entry.main.humidity,
          windSpeed: entry.wind.speed,
          visibility: entry.visibility ?? 0,
          solar: entry.solarRadiation ?? 0, // placeholder, API does not provide this directly
          dewPoint: entry.main.temp - (100 - entry.main.humidity) / 5,
          rainfall: entry.rain?.["3h"] ?? 0,
          snowfall: entry.snow?.["3h"] ?? 0,
        };
        setWeatherCache((prev) => ({ ...prev, [key]: weather }));
        onWeatherFetch(weather);
      }
    } else {
      const data = forecast16[daysDiff];
      if (data) {
        const weather = {
          temperature: data.temp.day,
          humidity: data.humidity,
          windSpeed: data.speed,
          visibility: data.visibility ?? 0, // not typically present
          solar: data.solarRadiation ?? 0, // placeholder
          dewPoint: data.temp.day - (100 - data.humidity) / 5,
          rainfall: data.rain ?? 0,
          snowfall: data.snow ?? 0,
        };
        setWeatherCache((prev) => ({ ...prev, [key]: weather }));
        onWeatherFetch(weather);
      }
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <span
        style={{ cursor: "pointer", fontWeight: "bold" }}
        onClick={() => setShowPicker(!showPicker)}
      >
        📅 {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}
      </span>
      {showPicker && (
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          locale={ko}
          dateFormat="yyyy년 MM월 dd일"
          inline
        />
      )}
    </div>
  );
}

export default DateSelector;
