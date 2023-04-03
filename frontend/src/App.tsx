import { Navbar } from './Components/Navbar'
import { Box } from '@mui/system'
import { Route, Routes } from 'react-router-dom'
import { Home } from './Pages/Home'
import { Expenses } from './Pages/Expenses'
import { Users } from './Pages/Users'
import { Categories } from './Pages/Categories'
import { UserDetailed } from './Pages/UserDetailed'
import { ExpenseAdd } from './Pages/ExpenseAdd'

function App() {
  return (
    <Box>
        <Navbar/>
      	<Routes>
			<Route path='/' element={<Home/>}></Route>
			<Route path='/expenses' element={<Expenses/>}></Route>
			<Route path='/expenses/add' element={<ExpenseAdd/>}></Route>
			<Route path='/users' element={<Users/>}></Route>
			<Route path='/categories' element={<Categories/>}></Route>
			<Route path='/users/:id' element={<UserDetailed/>}></Route>
      	</Routes>
    </Box>
  )
}

export default App
