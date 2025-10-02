import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserRole } from '../../lib/supabase';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { toast } from 'sonner';
interface EventsTabProps {
  courseId: string;
  userRole: UserRole;
}
interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  type: 'class' | 'personal';
  createdBy: string;
}
const EventsTab: React.FC<EventsTabProps> = ({
  courseId,
  userRole
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [eventStartTime, setEventStartTime] = useState('09:00');
  const [eventEndTime, setEventEndTime] = useState('10:30');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState<'class' | 'personal'>('class');
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an actual Supabase query
        // This is just mock data for the example
        setEvents([{
          id: 1,
          title: 'Lecture: Introduction',
          date: '2023-11-08',
          startTime: '09:00',
          endTime: '10:30',
          location: 'Room 101',
          description: 'Introduction to the course concepts',
          type: 'class',
          createdBy: 'Dr. Smith'
        }, {
          id: 2,
          title: 'Lab Session',
          date: '2023-11-10',
          startTime: '13:00',
          endTime: '15:00',
          location: 'Lab 3',
          description: 'Practical exercises on the concepts learned',
          type: 'class',
          createdBy: 'Dr. Smith'
        }, {
          id: 3,
          title: 'Study Group Meeting',
          date: '2023-11-12',
          startTime: '16:00',
          endTime: '18:00',
          location: 'Library',
          description: 'Group study for upcoming quiz',
          type: 'personal',
          createdBy: 'You'
        }]);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [courseId]);
  const handleCreateEvent = async () => {
    try {
      // In a real app, this would be an actual Supabase insert
      // This is just a mock for the example
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newEvent: Event = {
        id: events.length + 1,
        title: eventTitle,
        date: eventDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        location: eventLocation,
        description: eventDescription,
        type: eventType,
        createdBy: userRole === 'Lecturer' ? 'Dr. Smith' : userRole === 'ClassRep' ? 'Class Rep' : 'You'
      };
      setEvents([...events, newEvent]);
      toast.success('Event created successfully');
      setShowEventModal(false);
      resetEventForm();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };
  const resetEventForm = () => {
    setEventTitle('');
    setEventDate(format(new Date(), 'yyyy-MM-dd'));
    setEventStartTime('09:00');
    setEventEndTime('10:30');
    setEventLocation('');
    setEventDescription('');
    setEventType('class');
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };
  const selectedDateEvents = getDayEvents(selectedDate);
  const canCreateClassEvent = userRole === 'Lecturer' || userRole === 'ClassRep' || userRole === 'Admin';
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
          Course Calendar
        </h2>
        <div className="flex space-x-2">
          <button onClick={() => {
          setEventType(canCreateClassEvent ? 'class' : 'personal');
          setShowEventModal(true);
        }} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
            <Plus size={18} className="mr-2" />
            {canCreateClassEvent ? 'Add Event' : 'Add Personal Event'}
          </button>
          <button className="flex items-center px-4 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
            <Download size={18} className="mr-2" />
            Export Calendar
          </button>
        </div>
      </div>
      {isLoading ? <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        </div> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <div className="flex space-x-2">
                <button onClick={prevMonth} className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-700">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextMonth} className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-700">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-center text-sm font-medium text-secondary-500 dark:text-secondary-400 py-2">
                  {day}
                </div>)}
              {Array.from({
            length: startOfMonth(currentMonth).getDay()
          }).map((_, index) => <div key={`empty-start-${index}`} className="h-24 p-1"></div>)}
              {daysInMonth.map(day => {
            const dayEvents = getDayEvents(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelectedDay = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            return <div key={day.toString()} onClick={() => setSelectedDate(day)} className={`h-24 p-1 border border-secondary-100 dark:border-secondary-700 rounded-lg ${isCurrentMonth ? '' : 'opacity-50'} ${isSelectedDay ? 'bg-primary-50 dark:bg-primary-900 border-primary-300 dark:border-primary-700' : 'hover:bg-secondary-50 dark:hover:bg-secondary-750'} cursor-pointer transition-colors`}>
                    <div className="flex justify-between items-start">
                      <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-sm ${isTodayDate ? 'bg-primary-600 text-white' : isSelectedDay ? 'font-medium text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'}`}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                          {dayEvents.length}{' '}
                          {dayEvents.length === 1 ? 'event' : 'events'}
                        </span>}
                    </div>
                    <div className="mt-1 space-y-1 overflow-hidden max-h-14">
                      {dayEvents.slice(0, 2).map(event => <div key={event.id} className={`text-xs truncate px-1 py-0.5 rounded ${event.type === 'class' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200'}`}>
                          {event.title}
                        </div>)}
                      {dayEvents.length > 2 && <div className="text-xs text-secondary-500 dark:text-secondary-400 pl-1">
                          +{dayEvents.length - 2} more
                        </div>}
                    </div>
                  </div>;
          })}
              {Array.from({
            length: (7 - (startOfMonth(currentMonth).getDay() + daysInMonth.length) % 7) % 7
          }).map((_, index) => <div key={`empty-end-${index}`} className="h-24 p-1"></div>)}
            </div>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            {selectedDateEvents.length === 0 ? <div className="text-center py-8">
                <CalendarIcon size={32} className="mx-auto text-secondary-400" />
                <p className="mt-2 text-secondary-500 dark:text-secondary-400">
                  No events scheduled for this day
                </p>
                <button onClick={() => {
            setEventDate(format(selectedDate, 'yyyy-MM-dd'));
            setEventType(canCreateClassEvent ? 'class' : 'personal');
            setShowEventModal(true);
          }} className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                  <Plus size={18} className="mr-2" />
                  Add Event
                </button>
              </div> : <div className="space-y-4">
                {selectedDateEvents.map(event => <div key={event.id} className={`p-4 rounded-lg ${event.type === 'class' ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800' : 'bg-accent-50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-800'}`}>
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                      {event.title}
                    </h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                        <Clock size={14} className="mr-2" />
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.location && <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                          <MapPin size={14} className="mr-2" />
                          {event.location}
                        </div>}
                    </div>
                    {event.description && <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                        {event.description}
                      </p>}
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        Added by {event.createdBy}
                      </span>
                      <div className="flex space-x-2">
                        {(canCreateClassEvent || event.type === 'personal') && <button className="text-sm text-primary-600 hover:text-primary-500">
                            Edit
                          </button>}
                        <button className="text-sm text-primary-600 hover:text-primary-500">
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  </div>)}
                <button onClick={() => {
            setEventDate(format(selectedDate, 'yyyy-MM-dd'));
            setEventType(canCreateClassEvent ? 'class' : 'personal');
            setShowEventModal(true);
          }} className="w-full inline-flex justify-center items-center px-4 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
                  <Plus size={18} className="mr-2" />
                  Add Event
                </button>
              </div>}
          </div>
        </div>}
      {/* Create Event Modal */}
      {showEventModal && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-secondary-900 bg-opacity-75" onClick={() => setShowEventModal(false)}></div>
            <div className="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-secondary-800 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  Create New Event
                </h3>
                <button onClick={() => setShowEventModal(false)} className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="eventTitle" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Event Title *
                  </label>
                  <input type="text" id="eventTitle" value={eventTitle} onChange={e => setEventTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="e.g., Lecture: Introduction" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Date *
                    </label>
                    <input type="date" id="eventDate" value={eventDate} onChange={e => setEventDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" required />
                  </div>
                  {canCreateClassEvent && <div>
                      <label htmlFor="eventType" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        Event Type
                      </label>
                      <select id="eventType" value={eventType} onChange={e => setEventType(e.target.value as 'class' | 'personal')} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100">
                        <option value="class">Class Event (shared)</option>
                        <option value="personal">Personal Event</option>
                      </select>
                    </div>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventStartTime" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Start Time *
                    </label>
                    <input type="time" id="eventStartTime" value={eventStartTime} onChange={e => setEventStartTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" required />
                  </div>
                  <div>
                    <label htmlFor="eventEndTime" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      End Time *
                    </label>
                    <input type="time" id="eventEndTime" value={eventEndTime} onChange={e => setEventEndTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="eventLocation" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Location
                  </label>
                  <input type="text" id="eventLocation" value={eventLocation} onChange={e => setEventLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="e.g., Room 101" />
                </div>
                <div>
                  <label htmlFor="eventDescription" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Description
                  </label>
                  <textarea id="eventDescription" value={eventDescription} onChange={e => setEventDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="Brief description of the event" />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button onClick={() => setShowEventModal(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                    Cancel
                  </button>
                  <button onClick={handleCreateEvent} disabled={!eventTitle || !eventDate || !eventStartTime || !eventEndTime} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default EventsTab;