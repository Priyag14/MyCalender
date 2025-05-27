import React, { useState } from 'react';
import { Calendar, Search, Filter, Plus, ChevronLeft, ChevronRight, Clock, X, Palette, Check, Trash2 } from 'lucide-react';
import './App.css'
const EventModal = ({ event, onClose, onSave, onDelete, selectedDate, categories, recurrenceOptions }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: event?.date || (selectedDate || ''),
    time: event?.time || '',
    description: event?.description || '',
    category: event?.category || 'work',
    recurrence: event?.recurrence || 'none'
  });

  const handleSubmit = () => {
    if (formData.title && formData.date && formData.time) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {event ? 'Edit Event' : 'Add New Event'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter event title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Event description..."
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  className={`p-3 rounded-lg border-2 flex items-center gap-2 text-sm font-medium transition-all ${
                    formData.category === category.id 
                      ? `${category.bgColor} ${category.textColor} border-current` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence</label>
            <select
              value={formData.recurrence}
              onChange={(e) => setFormData(prev => ({ ...prev, recurrence: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {recurrenceOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 font-medium"
            >
              <Check className="w-4 h-4" />
              {event ? 'Update Event' : 'Create Event'}
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      date: '2025-05-27',
      time: '10:00',
      description: 'Weekly team sync',
      category: 'work',
      recurrence: 'weekly'
    },
    {
      id: 2,
      title: 'Lunch with Sarah',
      date: '2025-05-28',
      time: '12:30',
      description: 'Catch up lunch',
      category: 'personal',
      recurrence: 'none'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [draggedEvent, setDraggedEvent] = useState(null);

  const categories = [
    { id: 'work', name: 'Work', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { id: 'personal', name: 'Personal', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { id: 'health', name: 'Health', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    { id: 'social', name: 'Social', bgColor: 'bg-purple-100', textColor: 'text-purple-800' }
  ];

  const recurrenceOptions = [
    { id: 'none', name: 'No Repeat' },
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' }
  ];

  // Helper function to format date as YYYY-MM-DD
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Helper function to get today's date string
  const getTodayString = () => {
    const today = new Date();
    return formatDateString(today);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = formatDateString(date);
    return events.filter(event => {
      const eventMatches = event.date === dateString;
      const searchMatches = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatches = filterCategory === 'all' || event.category === filterCategory;

      return eventMatches && searchMatches && categoryMatches;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleAddEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleEditEvent = (eventData) => {
    setEvents(prev => prev.map(event => 
      event.id === editingEvent.id ? { ...eventData, id: event.id } : event
    ));
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, date) => {
    e.preventDefault();
    if (draggedEvent) {
      const newDateString = formatDateString(date);
      setEvents(prev => prev.map(event =>
        event.id === draggedEvent.id
          ? { ...event, date: newDateString }
          : event
      ));
      setDraggedEvent(null);
    }
  };

  const handleDateClick = (date) => {
    const dateString = formatDateString(date);
    setSelectedDate(dateString);
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDate(null);
    setShowEventModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Calendar</h1>
                <p className="text-gray-600">Manage your events with style</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setSelectedDate(getTodayString());
                  setEditingEvent(null);
                  setShowEventModal(true);
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Event
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800">{formatDate(currentDate)}</h2>

            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-600">{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayEvents = getEventsForDate(date);
              const isCurrentDay = isToday(date);
              const isInCurrentMonth = isCurrentMonth(date);

              return (
                <div
                  key={index}
                  className={`min-h-32 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                    isInCurrentMonth
                      ? `border-gray-200 hover:border-purple-300 ${isCurrentDay ? 'bg-purple-50 border-purple-300' : 'hover:bg-gray-50'}` 
                      : 'border-gray-100 text-gray-400 bg-gray-50'
                  }`}
                  onClick={() => isInCurrentMonth && handleDateClick(date)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => isInCurrentMonth && handleDrop(e, date)}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isCurrentDay ? 'text-purple-700' : 
                    isInCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {date.getDate()}
                    {isCurrentDay && <div className="text-xs font-semibold text-purple-600">Today</div>}
                  </div>
                  {isInCurrentMonth && (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => {
                        const category = categories.find(cat => cat.id === event.category);
                        return (
                          <div
                            key={event.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, event)}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`p-2 rounded text-xs cursor-pointer hover:opacity-80 ${category?.bgColor} ${category?.textColor}`}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </div>
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 font-medium">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={editingEvent}
          selectedDate={selectedDate}
          categories={categories}
          recurrenceOptions={recurrenceOptions}
          onSave={editingEvent ? handleEditEvent : handleAddEvent}
          onDelete={editingEvent ? () => handleDeleteEvent(editingEvent.id) : null}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default CalendarApp;