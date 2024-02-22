import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://taskapp-backend-1.onrender.com/');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTodo = async () => {
    if (!title || !description) return;
    try {
      const response = await axios.post('https://taskapp-backend-1.onrender.com/save', {
        Title: title,
        Description: description,
      });
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const todo = todos.find(todo => todo._id === id);
      const response = await axios.post('https://taskapp-backend-1.onrender.com/update', {
        _id: id,
        Title: todo.Title,
        Description: todo.Description,
        Complete: !todo.Complete,
      });
      const updatedTodos = todos.map(todo =>
        todo._id === id ? { ...todo, Complete: !todo.Complete } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.post('https://taskapp-backend-1.onrender.com/delete', { _id: id });
      const updatedTodos = todos.filter(todo => todo._id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditTodo = async (id) => {
    const todoToEdit = todos.find(todo => todo._id === id);
    setEditTitle(todoToEdit.Title);
    setEditDescription(todoToEdit.Description);
    setEditMode(id);
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.post('https://taskapp-backend-1.onrender.com/update', {
        _id: id,
        Title: editTitle,
        Description: editDescription,
      });
      const updatedTodos = todos.map(todo =>
        todo._id === id ? { ...todo, Title: editTitle, Description: editDescription } : todo
      );
      setTodos(updatedTodos);
      setEditMode(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <>
    <Header className="py-4 bg-gray-100 text-gray-800"/>
    <div className="max-w-md mx-auto my-8">
      <div className="mb-4">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full mt-2 border border-gray-300 rounded-md p-2"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          onClick={handleAddTodo}
        >
          Add Todo
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Todo List</h2>
        {todos.map((todo) => (
          <div key={todo._id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.Complete}
              onChange={() => handleToggleComplete(todo._id)}
              className="mr-2"
            />
            <div>
              {editMode === todo._id ? (
                <div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="w-full mt-2 border border-gray-300 rounded-md p-2"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <button
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                    onClick={() => handleSaveEdit(todo._id)}
                  >
                    Save Edit
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className={`${todo.Complete ? 'line-through text-white' : 'text-white'}`}>
                    {todo.Title}
                  </h3>
                  <p className={`${todo.Complete ? 'line-through text-white' : 'text-white'}`}>
                    {todo.Description}
                  </p>
                </div>
              )}
            </div>
            <button
              className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md"
              onClick={() => handleEditTodo(todo._id)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md ml-2"
              onClick={() => handleDeleteTodo(todo._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default TodoList;
