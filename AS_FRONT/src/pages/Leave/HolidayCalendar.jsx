// HolidayCalendarPage.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const HolidayCalendar = () => {
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        // Fetch holidays from backend API
        fetch('/api/holidays')
            .then(res => res.json())
            .then(data => setHolidays(data));
    }, []);

    // Map holidays to events format required by react-big-calendar
    const events = holidays.map(h => ({
        title: h.name,
        start: new Date(h.date),
        end: new Date(h.date),
        allDay: true,
    }));

    return (
        <div>
            <h2>Holiday Calendar</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
            {/* Add Add/Edit/Delete holiday UI here */}
        </div>
    );
}

export default HolidayCalendar;
