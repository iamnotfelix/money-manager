import { useState } from 'react'
import { Button } from '@mui/material'
import { UsersTable } from '../Components/UsersTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Button variant='contained'>Asdf</Button>
      <UsersTable/>
      {/* <h1>MoneyManager</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
    </div>
  )
}

export default App
