import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/hello")
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return (
    <>
      <div id="header">
        <h1>{msg}</h1>
      </div>
    </>
  );
}

export default App;