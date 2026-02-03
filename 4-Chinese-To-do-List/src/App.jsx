import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  // Load todos from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem('chinese-new-year-todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Save todos on each modification
  useEffect(() => {
    localStorage.setItem('chinese-new-year-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app">
      {/* Lanternes décoratives */}
      <div className="lantern lantern-left"></div>
      <div className="lantern lantern-right"></div>

      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>

      <div className="petals">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="petal" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }}></div>
        ))}
      </div>

      <div className="container">
        <header className="header">
          <div className="title-container">
            <h1 className="title">新年快乐</h1>
            <p className="subtitle">New Year's Wish List</p>
          </div>
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{activeCount}</span>
              <span className="stat-label">To Do</span>
            </div>
            <div className="stat-divider">•</div>
            <div className="stat">
              <span className="stat-value">{completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </header>

        <form onSubmit={addTodo} className="add-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a wish for the new year..."
              className="todo-input"
            />
            <button type="submit" className="add-button">
              <span className="button-icon">🏮</span>
              <span className="button-text">Add</span>
            </button>
          </div>
        </form>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            À faire
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Accomplis
          </button>
        </div>

        <div className="todos-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧧</div>
              <p className="empty-text">
                {filter === 'completed'
                  ? 'No wishes fulfilled at this time'
                  : filter === 'active'
                  ? 'No pending wishes'
                  : 'Start by adding your wishes for the year'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  className="checkbox"
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={todo.completed ? 'Mark as not done' : 'Mark as done'}
                >
                  {todo.completed && <span className="checkmark">✓</span>}
                </button>
                <span className="todo-text">{todo.text}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <footer className="footer">
          <div className="fortune">
            <span className="fortune-icon">🐉</span>
            <span className="fortune-text">May this year bring prosperity and happiness to you</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
