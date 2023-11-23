import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import viLocale from '@fullcalendar/core/locales/vi';
import { useState, useEffect, useRef } from 'react';
import axios from '~/utils/api/axios';
const Calendar = () => {
    const [branchData, setBranchData] = useState([]);
    const [selectedRange, setSelectedRange] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(0);
    const calendarRef = useRef();
    useEffect(() => {
        axios
            .get(`/branch`)
            .then((res) => {
                setBranchData(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (selectedRange) {
            const data = { start: selectedRange.start.split('T')[0], end: selectedRange.end.split('T')[0] };
            data.branch = selectedBranch;
            axios
                .post(`/calendar`, data)
                .then((res) => {
                    let data123 = res.data.map((item) => {
                        const startDate = new Date(item.date + parseInt(item.time) * 3600000);
                        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

                        return {
                            id: item.id,
                            title: `Đơn hàng ${item.id}`,
                            start: startDate.toISOString(),
                            end: endDate.toISOString(),
                        };
                    });
                    let calendarApi = calendarRef.current.getApi();
                    const calendarList = calendarApi.getEvents();
                    calendarList.forEach((event) => {
                        event.remove();
                    });
                    data123.forEach((event) => {
                        calendarApi.addEvent(event);
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedRange, selectedBranch]);

    const handleBranchChange = (event) => {
        const selectedBranchId = parseInt(event.target.value);
        setSelectedBranch(selectedBranchId);
    };

    const handleDatesSet = (dateInfo) => {
        if (!selectedRange || selectedRange.start !== dateInfo.startStr || selectedRange.end !== dateInfo.endStr) {
            setSelectedRange({
                start: dateInfo.startStr,
                end: dateInfo.endStr,
            });
        }
    };

    return (
        <Box m="20px">
            <Header title="Lịch" subtitle="Lịch làm việc đầy đủ" />
            <div>
                <label htmlFor="branch">Chọn chi nhánh</label>
                <select name="branch" id="branch" style={{ width: '200px' }} onChange={handleBranchChange} value={selectedBranch}>
                    <option value={0}>Chọn chi nhánh</option>
                    {branchData.map((element, index) => (
                        <option key={index} value={element.id}>
                            {element.address}
                        </option>
                    ))}
                </select>
            </div>
            <Box display="flex" justifyContent="space-between">
                <Box flex="1 1 100%" ml="15px">
                    <FullCalendar
                        height="75vh"
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        datesSet={handleDatesSet}
                        locales={[viLocale]}
                        locale="vi"
                        ref={calendarRef}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Calendar;
