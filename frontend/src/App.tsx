import { Navbar } from './Components/Navbar'
import { Box } from '@mui/system'
import { Route, Routes } from 'react-router-dom'
import { Home } from './Pages/Home'
import { Expenses } from './Pages/Expenses'
import { Users } from './Pages/Users'
import { Categories } from './Pages/Categories'
import { UserDetailed } from './Pages/UserDetailed'
import { ExpenseAdd } from './Pages/ExpenseAdd'
import { ExpenseDetailed } from './Pages/ExpenseDetailed'
import { CategoryDetailed } from './Pages/CategoryDetailed'
import { ExpenseUpdate } from './Pages/ExpenseUpdate'

function App() {
  return (
    <Box>
        <Navbar/>
      	<Routes>
			<Route path='/' element={<Home/>}></Route>

			<Route path='/expenses' element={<Expenses/>}></Route>
			<Route path='/expenses/:id' element={<ExpenseDetailed/>}></Route>
			<Route path='/expenses/add' element={<ExpenseAdd/>}></Route>
			<Route path='/expenses/:id/update' element={<ExpenseUpdate/>}></Route>

			<Route path='/users' element={<Users/>}></Route>
			<Route path='/users/:id' element={<UserDetailed/>}></Route>
			<Route path='/categories' element={<Categories/>}></Route>
			<Route path='/categories/:id' element={<CategoryDetailed/>}></Route>
      	</Routes>
    </Box>
  )
}

export default App
