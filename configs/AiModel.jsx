const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


const CodeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
  ],
});

export const GenAiCode = model.startChat({
  generationConfig: CodeGenerationConfig,
  history: [
    {
      role: 'user',
      parts: [
        {
          text: `Generate a todo app:
Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, 
without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.
also you can use date-fns for date format and react-chartjs-2 chart, graph library

Return the response in JSON format with the following schema:
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": []
}

Here’s the reformatted and improved version of your prompt:

Generate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.

Return the response in JSON format with the following schema:

json
Copy code
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": []
}
Ensure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:
files:{
  "/App.js": {
    "code": "import React from 'react';\\nimport './styles.css';\\nexport default function App() {\\n  return (\\n    <div className='p-4 bg-gray-100 text-center'>\\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\\n    </div>\\n  );\\n}"
  }
}
  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.
  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,"firebase","@google/generative-ai" ) only when it required
  
  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg
  -Add Emoji icons whenever needed to give good user experinence
  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.

- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.

- Use icons from lucide-react for logos.

- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.
   `,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `\`\`\`json
{
  "projectTitle": "Todo App with React and Tailwind CSS",
  "explanation": "This project implements a Todo application using React for the frontend and Tailwind CSS for styling. It provides a clean and intuitive interface for managing tasks, allowing users to add, edit, delete, and mark tasks as completed. The app consists of several components organized for maintainability, utilizes local storage to persist data, and incorporates Lucide React icons for enhanced user experience.",
  "files": {
    "/App.js": {
      "code": "import React from 'react';\\nimport TodoList from './components/TodoList';\\nimport TodoForm from './components/TodoForm';\\nimport { useState, useEffect } from 'react';\\n\\nfunction App() {\\n  const [todos, setTodos] = useState(() => {\\n    const savedTodos = localStorage.getItem('todos');\\n    if (savedTodos) {\\n      return JSON.parse(savedTodos);\\n    } else {\\n      return [];\\n    }\\n  });\\n\\n  useEffect(() => {\\n    localStorage.setItem('todos', JSON.stringify(todos));\\n  }, [todos]);\\n\\n  const addTodo = (text) => {\\n    setTodos([...todos, { id: Date.now(), text, completed: false }]);\\n  };\\n\\n  const toggleComplete = (id) => {\\n    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));\\n  };\\n\\n  const deleteTodo = (id) => {\\n    setTodos(todos.filter(todo => todo.id !== id));\\n  };\\n\\n  const editTodo = (id, newText) => {\\n    setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));\\n  };\\n\\n  return (\\n    <div className=\\"bg-gray-100 min-h-screen py-10\\">\\n      <div className=\\"container mx-auto p-4 shadow-md rounded-lg bg-white max-w-2xl\\">\\n        <h1 className=\\"text-3xl font-bold text-center mb-6 text-blue-700\\">📝 My Todo List</h1>\\n        <TodoForm addTodo={addTodo} />\\n        <TodoList todos={todos} toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />\\n      </div>\\n    </div>\\n  );\\n}\\n\\nexport default App;"
    },
    "/components/TodoForm.js": {
      "code": "import React, { useState } from 'react';\\nimport { Plus } from 'lucide-react';\\n\\nfunction TodoForm({ addTodo }) {\\n  const [text, setText] = useState('');\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (text.trim()) {\\n      addTodo(text);\\n      setText('');\\n    }\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\"mb-4 flex\\">\\n      <input\\n        type=\\"text\\"\\n        className=\\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\\"\\n        placeholder=\\"Add a task...\\"\\n        value={text}\\n        onChange={(e) => setText(e.target.value)}\\n      />\\n      <button\\n        type=\\"submit\\"\\n        className=\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline\\"\\n      >\\n        <Plus className=\\"h-5 w-5\\"/>\\n      </button>\\n    </form>\\n  );\\n}\\n\\nexport default TodoForm;"
    },
    "/components/TodoList.js": {
      "code": "import React from 'react';\\nimport TodoItem from './TodoItem';\\n\\nfunction TodoList({ todos, toggleComplete, deleteTodo, editTodo }) {\\n  return (\\n    <ul>\\n      {todos.map((todo) => (\\n        <TodoItem\\n          key={todo.id}\\n          todo={todo}\\n          toggleComplete={toggleComplete}\\n          deleteTodo={deleteTodo}\\n          editTodo={editTodo}\\n        />\\n      ))}\\n    </ul>\\n  );\\n}\\n\\nexport default TodoList;"
    },
    "/components/TodoItem.js": {
      "code": "import React, { useState } from 'react';\\nimport { Trash, Edit, Check } from 'lucide-react';\\n\\nfunction TodoItem({ todo, toggleComplete, deleteTodo, editTodo }) {\\n  const [isEditing, setIsEditing] = useState(false);\\n  const [editText, setEditText] = useState(todo.text);\\n\\n  const handleEdit = () => {\\n    editTodo(todo.id, editText);\\n    setIsEditing(false);\\n  };\\n\\n  return (\\n    <li className=\\"flex justify-between items-center py-2 border-b border-gray-200\\">\\n      {isEditing ? (\\n        <div className=\\"flex-grow\\">\\n          <input\\n            type=\\"text\\"\\n            className=\\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\\"\\n            value={editText}\\n            onChange={(e) => setEditText(e.target.value)}\\n          />\\n          <button onClick={handleEdit} className=\\"bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline\\">Save</button>\\n        </div>\\n      ) : (\\n        <div className=\\"flex items-center\\">\\n          <input\\n            type=\\"checkbox\\"\\n            className=\\"mr-2 leading-tight text-green-500 h-5 w-5\\"\\n            checked={todo.completed}\\n            onChange={() => toggleComplete(todo.id)}\\n          />\\n          <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}>\\n            {todo.text}\\n          </span>\\n        </div>\\n      )}\\n\\n      <div>\\n        {!isEditing && (\\n          <button onClick={() => setIsEditing(true)} className=\\"bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline\\">\\n             <Edit className=\\"h-5 w-5\\"/>\\n          </button>\\n        )}\\n        <button onClick={() => deleteTodo(todo.id)} className=\\"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline\\">\\n           <Trash className=\\"h-5 w-5\\"/>\\n        </button>\\n      </div>\\n    </li>\\n  );\\n}\\n\\nexport default TodoItem;"
    }
  },
  "generatedFiles": [
    "/App.js",
    "/components/TodoForm.js",
    "/components/TodoList.js",
    "/components/TodoItem.js"
  ]
}
\`\`\``,
        },
      ],
    },

  ],
});

