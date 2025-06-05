import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

function DateSelector({ onDateSelect, onWeatherFetch }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [weatherCache, setWeatherCache] = useState({});
  const [forecastList, setForecastList] = useState([]);
  const [location, setLocation] = useState({ lat: null, lon: null });

  // 🌍 컴포넌트 mount 시 현재 위치 가져오기
  // 1. 위치 설정
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("위치 정보를 가져오지 못했습니다:", err);
        setLocation({ lat: 37.5665, lon: 126.978 });
      }
    );
  }, []);

  // 2. 위치가 설정된 후 날씨 가져오기
  useEffect(() => {
    if (location.lat && location.lon) {
      fetchForecast();
    }
  }, [location]);

  const fetchForecast = async () => {
    try {
      const VITE_WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast/daily",
        {
          params: {
            lat: location.lat || 37.5665, // 기본값: 서울
            lon: location.lon || 126.978,
            cnt: 16,
            units: "metric",
            appid: VITE_WEATHER_API_KEY,
          },
        }
      );
      console.log("📡 날씨 API 응답:", res.data); // ← 콘솔 출력 추가

      setForecastList(res.data.list);
    } catch (err) {
      console.error("날씨 API 요청 실패:", err);
    }
  };

  const handleChange = (date) => {
    setSelectedDate(date);
    setShowPicker(false);
    onDateSelect(date);

    const key = format(date, "yyyy-MM-dd");
    if (weatherCache[key]) {
      onWeatherFetch(weatherCache[key]); // 캐시 사용
    } else {
      const daysDiff = Math.floor(
        (date.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      );
      const data = forecastList[daysDiff];
      if (data) {
        const weather = {
          temperature: data.temp.day,
          humidity: data.humidity,
          windSpeed: data.speed,
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
      <h1
        style={{ cursor: "pointer", fontWeight: "bold" }}
        onClick={() => setShowPicker(!showPicker)}
      >
        📅 {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}
      </h1>
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
