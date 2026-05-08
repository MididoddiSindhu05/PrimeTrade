import { useEffect, useState } from 'react';
import { apiRequest } from './api';

const initialForm = { name: '', email: '', password: '', role: 'user' };

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

function App() {
  const [view, setView] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('primetrade_token') || '');
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    if (token) {
      const parsed = parseJwt(token);
      if (parsed) {
        setUser({ email: parsed.email, role: parsed.role, name: parsed.email.split('@')[0] });
        setView('dashboard');
        fetchTasks();
        if (parsed.role === 'admin') {
          fetchUsers(token);
        }
      }
    }
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 4500);
  };

  const persistToken = (tokenValue) => {
    setToken(tokenValue);
    if (tokenValue) {
      localStorage.setItem('primetrade_token', tokenValue);
    } else {
      localStorage.removeItem('primetrade_token');
    }
  };

  const authenticate = async (path) => {
    try {
      const response = await apiRequest(path, 'POST', form);
      if (path === 'auth/login') {
        persistToken(response.token);
        setUser(parseJwt(response.token));
        setView('dashboard');
        showMessage('Welcome back! Your secure session is active.');
      } else {
        showMessage('Registration complete — now please log in.');
        setView('login');
        setForm(initialForm);
      }
    } catch (error) {
      showMessage(error.message || 'Authentication failed');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await apiRequest('tasks', 'GET', null, token);
      setTasks(response);
    } catch (error) {
      showMessage('Unable to load tasks');
    }
  };

  const fetchUsers = async (tokenValue) => {
    try {
      const response = await apiRequest('admin/users', 'GET', null, tokenValue);
      setAdminUsers(response);
    } catch {
      setAdminUsers([]);
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) {
      showMessage('Task title is required');
      return;
    }

    try {
      await apiRequest('tasks', 'POST', newTask, token);
      setNewTask({ title: '', description: '' });
      await fetchTasks();
      showMessage('New task added to your workspace');
    } catch (error) {
      showMessage('Failed to add task');
    }
  };

  const updateTask = async (task) => {
    try {
      await apiRequest(`tasks/${task.id}`, 'PUT', { ...task, completed: !task.completed }, token);
      await fetchTasks();
      showMessage(`Task marked ${task.completed ? 'open' : 'completed'}`);
    } catch (error) {
      showMessage('Failed to update task');
    }
  };

  const removeTask = async (id) => {
    try {
      await apiRequest(`tasks/${id}`, 'DELETE', null, token);
      await fetchTasks();
      showMessage('Task removed successfully');
    } catch (error) {
      showMessage('Failed to remove task');
    }
  };

  const logout = () => {
    persistToken('');
    setUser(null);
    setView('login');
    setTasks([]);
    setForm(initialForm);
    setNewTask({ title: '', description: '' });
    setAdminUsers([]);
  };

  const activeTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  if (view === 'dashboard' && token) {
    return (
      <div className="app-shell">
        <nav className="nav-bar">
          <div className="brand">
            <span>Prime</span>Trade
          </div>
          <div className="nav-actions">
            <a href="/api/v1/docs" target="_blank" rel="noreferrer">API docs</a>
            <button className="ghost" onClick={logout}>Logout</button>
          </div>
        </nav>

        <div className="page-header">
          <div>
            <p className="eyebrow">Secure backend dashboard</p>
            <h1>Operational control center</h1>
            <p className="intro">A polished administrative interface for authenticated users, task management, and role-based insights.</p>
          </div>
          <div className="profile-card">
            <span>Signed in as</span>
            <h2>{user?.name || user?.email}</h2>
            <p>{user?.role === 'admin' ? 'Administrator' : 'Standard user'}</p>
          </div>
        </div>

        {message && <div className="message banner">{message}</div>}

        <section className="dashboard-panel">
          <div className="stats-card">
            <span>Performance at a glance</span>
            <h2>{tasks.length || 0} total tasks</h2>
            <p className="subtle">All operations are backed by JWT authentication and secure API validation.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-box">
              <span>Open tasks</span>
              <h3>{activeTasks}</h3>
            </div>
            <div className="stat-box">
              <span>Completed</span>
              <h3>{completedTasks}</h3>
            </div>
            <div className="stat-box">
              <span>Role</span>
              <h3>{user?.role || 'user'}</h3>
            </div>
          </div>
        </section>

        <section className="task-panel">
          <div className="task-form-card">
            <div className="form-header">
              <div>
                <p className="eyebrow">Task create</p>
                <h2>Add a secure task</h2>
              </div>
              <span className="pill">Connected</span>
            </div>
            <input name="title" value={newTask.title} onChange={handleTaskChange} placeholder="Task title" />
            <textarea name="description" value={newTask.description} onChange={handleTaskChange} placeholder="Short description (optional)" rows="4" />
            <button className="primary" onClick={addTask}>Save task</button>
          </div>

          <div className="task-list">
            <div className="task-list-header">
              <div>
                <h2>Your tasks</h2>
                <p className="subtle">Manage your active workflow items securely.</p>
              </div>
              <span>{tasks.length} total</span>
            </div>
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks yet.</p>
                <small>Use the form to create your first task and see it appear instantly.</small>
              </div>
            ) : (
              tasks.map((task) => (
                <article key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description || 'No description provided'}</p>
                  </div>
                  <div className="task-meta">
                    <span className="badge">{task.completed ? 'Completed' : 'Open'}</span>
                    <div className="task-actions">
                      <button className="secondary" onClick={() => updateTask(task)}>{task.completed ? 'Reopen' : 'Complete'}</button>
                      <button className="danger" onClick={() => removeTask(task.id)}>Delete</button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {user?.role === 'admin' && adminUsers.length > 0 && (
          <section className="admin-panel">
            <div className="section-heading">
              <h2>Admin users</h2>
              <span>{adminUsers.length} accounts</span>
            </div>
            <div className="admin-table">
              <div className="table-row header">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
              </div>
              {adminUsers.map((account) => (
                <div key={account.id} className="table-row">
                  <span>{account.name}</span>
                  <span>{account.email}</span>
                  <span className="badge secondary-badge">{account.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="app-shell auth-shell">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">Primetrade UI</p>
          <h1>Premium access for your backend workflow</h1>
          <p className="intro">A polished interface for registration, login, and secure task management with JWT-backed authorization.</p>
        </div>
        <div className="hero-highlights">
          <div>
            <strong>Fast auth</strong>
            <span>Password hashing + JWT for safe access.</span>
          </div>
          <div>
            <strong>Role control</strong>
            <span>Built-in user/admin boundaries.</span>
          </div>
          <div>
            <strong>Responsive UI</strong>
            <span>Designed for elegant demos and client review.</span>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-header">
            <div>
              <p className="eyebrow">Welcome</p>
              <h2>{view === 'login' ? 'Sign in to continue' : 'Create your account'}</h2>
            </div>
          </div>

          {message && <div className="message banner">{message}</div>}

          <div className="auth-form">
            {view === 'register' && (
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
            )}
            <label className="role-select">
              <span>{view === 'login' ? 'Sign in as' : 'Account type'}</span>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email address" />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
            <button className="primary" onClick={() => authenticate(`auth/${view}`)}>
              {view === 'login' ? 'Login' : 'Register'}
            </button>
            <p className="switch-line">
              {view === 'login' ? 'New to Primetrade?' : 'Already have an account?'}{' '}
              <button className="link" onClick={() => { setView(view === 'login' ? 'register' : 'login'); setForm(initialForm); }}>
                {view === 'login' ? 'Register now' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
