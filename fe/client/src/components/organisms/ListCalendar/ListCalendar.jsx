/* eslint-disable react/prop-types */
import RatingBookingInterface from '../../atoms/RatingBookingInterface';
import ContainerWapper from '../../templates/ContainerWapper';

const ListCalendar = ({ currentDate, setCurrentDate, list, isBookNow = false }) => {
    return (
        <div className="h-[100px] w-[100%] bg-[#333545]">
            <ContainerWapper>
                <div className="w-[100%] h-[65px] flex justify-between items-center gap-[20px]">
                    <div className="w-[100%] h-[65px] flex justify-start items-center gap-[20px]">
                        {list.map((item, index) => (
                            <CalendarCommon
                                data={item}
                                key={index}
                                setCurrentDate={setCurrentDate}
                                currentDate={currentDate}
                            />
                        ))}
                    </div>
                    {isBookNow && <RatingBookingInterface />}
                </div>
            </ContainerWapper>
        </div>
    );
};

export default ListCalendar;

const CalendarCommon = ({ data, setCurrentDate, currentDate }) => {
    const dateObj = new Date(data.date);
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const day = weekdays[dateObj.getDay()];
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;

    return (
        <div
            className={`w-[65px] h-[65px] cursor-pointer rounded-[10px] overflow-hidden ${
                currentDate === data.date ? 'bg-red-500' : ''
            }`}
            onClick={() => setCurrentDate(data?.date)}
        >
            <div className={`h-[25px] flex justify-center items-center`}>
                <p className="text-white">{day}</p>
            </div>
            <div className={`h-[45px] flex justify-center items-center ${data.isToday ? 'bg-white' : 'text-white'}`}>
                {date} - {month}
            </div>
        </div>
    );
};
