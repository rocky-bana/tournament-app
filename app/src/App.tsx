import { useEffect, useState } from 'react';
import './App.css'

function App() {
  const [data, setData] = useState(null);
   const [inputValue, setInputValue] = useState('');

  useEffect(() => {
  fetch('http://localhost:8000/items/' + inputValue)
    .then(response => response.json())
    .then(data => 
      setData(data)
    );
}, [inputValue]);
  return (
      <div>
        <h1>Hello World</h1>
         <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter something..."
        />

        <p>{data ? `Item ID: ${data.Id}, Item Name: ${data.Name}` : 'Loading...'}</p>
        
      </div>
  
  )
}

export default App
