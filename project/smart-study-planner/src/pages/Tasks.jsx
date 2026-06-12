import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { format, differenceInDays } from 'date-fns';
import { Trash2, CheckCircle, Circle, Plus, CheckSquare } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Tasks page allowing users to view, create, complete, and delete tasks.
 * It also handles the creation of subjects to associate tasks with.
 */
export default function Tasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Forms state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#4f46e5');

  /**
   * Fetches latest Tasks and Subjects data from the backend APIs
   */
  const fetchData = async () => {
    try {
      const [tasksRes, subjectsRes] = await Promise.all([
        fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/subjects', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (subjectsRes.ok) setSubjects(await subjectsRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  /**
   * Handles form submission to create a new Subject
   */
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName) return;

    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newSubjectName, color: newSubjectColor }),
      });
      if (res.ok) {
        setNewSubjectName('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Handles form submission to create a new Task
   */
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskSubject || !newTaskDeadline) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          subject: newTaskSubject,
          deadline: new Date(newTaskDeadline).toISOString()
        }),
      });
      if (res.ok) {
        setNewTaskTitle('');
        setNewTaskDeadline('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Toggles the completed status of an existing task
   */
  const toggleTaskComplete = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (res.ok) {
        setTasks(tasks.map(t => t._id === task._id ? { ...t, completed: !task.completed } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Deletes a task dynamically and updates local state
   */
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Calculates the difference in days between the task deadline and today
   */
  const diffInDaysFast = (deadlineStr) => {
    return differenceInDays(new Date(deadlineStr), new Date());
  };

  /**
   * Generates badge styling class names and text dynamically based on the deadline
   */
  const getDeadlineBadgeInfo = (deadlineStr, completed) => {
    if (completed) {
      return { class: 'bg-emerald-500/10 text-emerald-600', text: 'Done' };
    }
    
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diff = differenceInDays(deadline, today);

    if (diff < 0) {
      return { class: 'bg-red-500/10 text-red-600', text: 'Overdue' };
    } else if (diff <= 2) {
      return { class: 'bg-yellow-500/10 text-yellow-600', text: 'Due Soon' };
    } else {
      return { class: 'bg-blue-500/10 text-blue-600', text: `${diff} days left` };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <header className="mb-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold uppercase">Tasks</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tasks Manager</h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold tracking-wide">Organize your study assignments and deadlines.</p>
        </div>
      </header>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Forms Section */}
        <div className="md:col-span-5 space-y-6">
          {/* Add Subject Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Add Subject</h3>
            <form onSubmit={handleAddSubject} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="e.g., Mathematics"
                  value={newSubjectName}
                  onChange={e => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newSubjectColor}
                  onChange={e => setNewSubjectColor(e.target.value)}
                  className="w-10 h-10 border-0 p-0 rounded-lg cursor-pointer bg-transparent"
                />
                <button type="submit" className="flex-1 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-colors shadow-sm">
                  Add Subject
                </button>
              </div>
            </form>
          </div>

          {/* Add Task Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Add Task</h3>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>
              <div>
                <select
                  value={newTaskSubject}
                  onChange={e => setNewTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                >
                  <option value="" disabled>Select Subject</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="date"
                  value={newTaskDeadline}
                  onChange={e => setNewTaskDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={subjects.length === 0}
                className="h-11 w-full bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50 mt-2"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>

        {/* Tasks List */}
        <div className="md:col-span-7 flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Project Task Queue</h2>
              <p className="text-[11px] text-slate-500">Overview of all assignments</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 shadow-sm">
                {tasks.filter(t => !t.completed).length} Pending
              </span>
              <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded text-[10px] font-bold text-emerald-600 shadow-sm">
                {tasks.filter(t => t.completed).length} Done
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center">
                <CheckSquare className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-xs font-semibold">No tasks found. Add a subject and then create a task.</p>
              </div>
            ) : (
              tasks.map(task => {
                const badge = getDeadlineBadgeInfo(task.deadline, task.completed);
                return (
                  <div key={task._id} className={cn(
                    "p-4 rounded-xl flex items-start gap-4 transition-colors group",
                    task.completed 
                      ? "border border-slate-100 bg-white opacity-60" 
                      : diffInDaysFast(task.deadline) < 0 
                        ? "border border-red-100 bg-red-50/30 ring-1 ring-red-500/10"
                        : diffInDaysFast(task.deadline) <= 2
                          ? "border border-yellow-100 bg-yellow-50/30 ring-1 ring-yellow-500/10"
                          : "border border-slate-100 bg-white hover:border-slate-300"
                  )}>
                    <button 
                      onClick={() => toggleTaskComplete(task)}
                      className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center mt-0.5 shrink-0 bg-white transition-all shadow-sm",
                        task.completed ? "border-emerald-500 bg-emerald-500" : "border-slate-200 hover:border-slate-400"
                      )}
                    >
                      {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-bold",
                        task.completed ? "text-slate-500 line-through" : "text-slate-800"
                      )}>
                        {task.title}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-shrink-0 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: task.subject?.color || '#ccc' }} 
                          />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide truncate max-w-[120px]">
                            {task.subject?.name || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide">
                          <span className="text-slate-400">Due:</span>
                          <span className={cn(
                            diffInDaysFast(task.deadline) < 0 && !task.completed ? "text-red-500 h-10 px-0 line-clamp-1 truncate min-w-0" : "text-slate-500"
                          )}>
                            {format(new Date(task.deadline), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-2 flex-shrink-0">
                      <span className={cn("px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider", badge.class)}>
                        {badge.text}
                      </span>
                      
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 -mr-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
