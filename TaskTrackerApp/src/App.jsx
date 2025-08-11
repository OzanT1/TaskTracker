import React, { useEffect, useState } from 'react';
import './App.css';

const API_BASE = 'https://localhost:7051';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editIsCompleted, setEditIsCompleted] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(`${API_BASE}/tasks`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  };

  const addTask = () => {
    if (!newTitle.trim()) return;

    fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate ? new Date(newDueDate).toISOString() : null
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add task');
        return res.json();
      })
      .then(() => {
        setNewTitle('');
        setNewDescription('');
        setNewDueDate('');
        fetchTasks();
      })
      .catch(err => console.error(err));
  };

  const deleteTask = (id) => {
    fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete task');
        fetchTasks();
      })
      .catch(err => console.error(err));
  };

  const completeTask = (task) => {
    fetch(`${API_BASE}/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: true })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to complete task');
        fetchTasks();
      })
      .catch(err => console.error(err));
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
    setEditIsCompleted(task.isCompleted);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditDescription('');
    setEditDueDate('');
    setEditIsCompleted(false);
  };

  const saveEdit = (id) => {
    fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
        isCompleted: editIsCompleted
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update task');
        cancelEdit();
        fetchTasks();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="app-bg">
      <h1 className="header">Task Tracker</h1>
      <div className="main-content">
        {/* Left: Add Task Panel */}
        <div className="add-task-panel">
          <h2 style={{ marginBottom: 18, fontSize: 20 }}>Add New Task</h2>
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              rows={3}
            />
            <input
              type="datetime-local"
              value={newDueDate}
              onChange={e => setNewDueDate(e.target.value)}
            />
          </div>
          <button onClick={addTask}>
            Add Task
          </button>
        </div>

        {/* Center-Right: Task List */}
        <div className="task-list-panel">
          <h2 style={{ marginBottom: 18, fontSize: 20 }}>All Tasks</h2>
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 20, color: '#888' }}>
                    No tasks found.
                  </td>
                </tr>
              )}
              {tasks.map(task => (
                <tr key={task.id}>
                  {editId === task.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                        />
                      </td>
                      <td>
                        <textarea
                          value={editDescription}
                          onChange={e => setEditDescription(e.target.value)}
                          rows={2}
                        />
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          value={editDueDate}
                          onChange={e => setEditDueDate(e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={editIsCompleted ? 'Completed' : 'Pending'}
                          onChange={e => setEditIsCompleted(e.target.value === 'Completed')}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => saveEdit(task.id)}>Save</button>
                        <button onClick={cancelEdit} style={{ marginLeft: 6 }}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>
                        {task.dueDate ? new Date(task.dueDate).toLocaleString() : '-'}
                      </td>
                      <td className={task.isCompleted ? 'status-completed' : 'status-pending'}>
                        {task.isCompleted ? 'Completed' : 'Pending'}
                      </td>
                      <td>
                        <button onClick={() => startEdit(task)}>Edit</button>
                        <button onClick={() => deleteTask(task.id)} style={{ marginLeft: 6 }}>Delete</button>
                        {!task.isCompleted && (
                          <button onClick={() => completeTask(task)} style={{ marginLeft: 6 }}>
                            Complete
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;