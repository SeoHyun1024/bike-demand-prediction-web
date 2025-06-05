import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";

function DateSelector({ onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (date) => {
    setSelectedDate(date);
    setShowPicker(false);
    onDateSelect(date); // 부모에게 알림
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
