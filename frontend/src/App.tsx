import { useState } from 'react'
import { Button } from '@mui/material'
import { UsersTable } from './Components/UsersTable'
import { Navbar } from './Components/Navbar'
import { Box } from '@mui/system'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box className="App">
      <Navbar/>
      {/* <h1>MoneyManager</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
    </Box>
  )
}

export default App
