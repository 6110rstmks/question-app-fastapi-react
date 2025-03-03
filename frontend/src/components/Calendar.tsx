import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns";
import styles from "./Calendar.module.css";


const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(currentDate);
    const startDate = startOfWeek(startMonth);
    const endDate = endOfWeek(endMonth);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className={styles.calendar_container}>
      {/* ヘッダー */}
      <div className={styles.calendar_header}>
        <button onClick={prevMonth} className={styles.nav_button}>◀</button>
        <h2 className={styles.calendar_title}>{format(currentDate, "yyyy年 MM月")}</h2>
        <button onClick={nextMonth} className={styles.nav_button}>▶</button>
      </div>

      {/* 曜日 */}
      <div className={styles.calendar_weekdays}>
        {["日", "月", "火", "水", "木", "金", "土"].map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>

      {/* 日付 */}
      <div className={styles.calendar_grid}>
        {days.map(day => (
          <div
            key={day.toString()}
            className={`calendar_day ${format(day, "MM") !== format(currentDate, "MM") ? "other_month" : ""} ${format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "today" : ""}`}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
