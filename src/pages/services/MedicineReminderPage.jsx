import React, { useState } from 'react';
import { Bell, Clock, Calendar, Plus, Trash2, Edit, Check, X, Mail } from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';
import { Button } from '../../components/ui/button';

const MedicineReminderPage = () => {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      medicine: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      time: "08:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      active: true
    },
    {
      id: 2,
      medicine: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "07:00, 19:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      active: true
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    medicine: "",
    dosage: "",
    frequency: "Once daily",
    time: "",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days: newDays };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setReminders(prev => prev.map(r => 
        r.id === editingId ? { ...r, ...formData } : r
      ));
      setEditingId(null);
    } else {
      const newReminder = {
        id: Date.now(),
        ...formData,
        active: true
      };
      setReminders(prev => [...prev, newReminder]);
    }
    setFormData({
      medicine: "",
      dosage: "",
      frequency: "Once daily",
      time: "",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    });
    setShowForm(false);
  };

  const handleEdit = (reminder) => {
    setFormData({
      medicine: reminder.medicine,
      dosage: reminder.dosage,
      frequency: reminder.frequency,
      time: reminder.time,
      days: reminder.days
    });
    setEditingId(reminder.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleActive = (id) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    ));
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      medicine: "",
      dosage: "",
      frequency: "Once daily",
      time: "",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    });
  };

  const features = [
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Customizable Alerts",
      description: "Set personalized reminders for each medication with custom times and frequencies."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Schedule reminders for specific days of the week or daily routines."
    },
    {
      icon: <Check className="w-8 h-8" />,
      title: "Track Adherence",
      description: "Monitor your medication adherence with our easy tracking system."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Calendar Integration",
      description: "Sync your medication schedule with your digital calendar."
    }
  ];

  return (
    <>
      <SEOHelmet 
        title="Medicine Reminder - CureBay"
        description="Never miss a dose with our personalized medicine reminder service. Set custom alerts and track your medication adherence."
        keywords="medicine reminder, medication alert, pill reminder, medication schedule, prescription reminder"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Bell className="w-12 h-12 text-cyan-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white transition-colors">
                Medicine Reminder
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Never miss a dose with our personalized medicine reminder service. 
              Set custom alerts and track your medication adherence.
            </p>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              How Our Medicine Reminder Helps You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl">
                  <div className="text-cyan-600 dark:text-cyan-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder Form */}
          {showForm && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                  {editingId ? "Edit Reminder" : "Add New Reminder"}
                </h2>
                <button 
                  onClick={cancelForm}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      name="medicine"
                      value={formData.medicine}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="e.g., Lisinopril"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                      Dosage
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="e.g., 10mg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                      Frequency
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white transition-colors"
                    >
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="As needed">As needed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                      Time(s)
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="e.g., 08:00, 12:00"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                    Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          formData.days.includes(day)
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    {editingId ? "Update Reminder" : "Add Reminder"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={cancelForm}
                    className="py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Reminders List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Your Medicine Reminders
              </h2>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Reminder
              </Button>
            </div>
            
            {reminders.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  No reminders set up yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
                  Add your first medicine reminder to get started
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg transition-colors"
                >
                  Add Your First Reminder
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reminders.map(reminder => (
                  <div 
                    key={reminder.id} 
                    className={`p-6 rounded-xl border transition-colors ${
                      reminder.active 
                        ? 'border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/10' 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mr-3 transition-colors">
                            {reminder.medicine}
                          </h3>
                          <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 rounded-full text-sm font-medium transition-colors">
                            {reminder.dosage}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-3">
                          <div className="flex items-center text-gray-600 dark:text-gray-300 transition-colors">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{reminder.frequency}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300 transition-colors">
                            <Bell className="w-4 h-4 mr-2" />
                            <span>{reminder.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {reminder.days.map(day => (
                            <span 
                              key={day} 
                              className="px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded text-sm transition-colors"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleActive(reminder.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            reminder.active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title={reminder.active ? "Disable reminder" : "Enable reminder"}
                        >
                          {reminder.active ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Edit reminder"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(reminder.id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                          title="Delete reminder"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 shadow-lg transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Improve Your Health Outcomes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                Consistent medication adherence is crucial for managing chronic conditions 
                and achieving optimal health outcomes. Our reminder system helps you stay on track.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">Reduce missed doses by up to 80%</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">Better manage chronic conditions</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">Improve communication with healthcare providers</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 shadow-lg transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Peace of Mind for Caregivers
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                Our medicine reminder service provides peace of mind for both patients 
                and their caregivers by ensuring medications are taken as prescribed.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">Real-time adherence tracking</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">Caregiver notifications</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">Medication history reports</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Notification Options */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Notification Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  Push Notifications
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Receive alerts directly on your mobile device with customizable sounds and vibration.
                </p>
              </div>
              
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  Email Reminders
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Get email notifications with detailed medication information and instructions.
                </p>
              </div>
              
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  Calendar Integration
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors">
                  Sync your medication schedule with Google Calendar, Outlook, or other calendar apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineReminderPage;