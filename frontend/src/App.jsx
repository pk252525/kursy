import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const kursy = ["Adam Coding","Meincrosoft Azure","Cisco", ];
  const [count, setCount] = useState(0)

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
      <div></div>
    </>
  )
}

export default App
