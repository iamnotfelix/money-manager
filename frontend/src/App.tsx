import { Navbar } from './Components/Navbar'
import { Box } from '@mui/system'
import { Route, Routes } from 'react-router-dom'
import { Home } from './Pages/Home'
import { Expenses } from './Pages/Expenses/Expenses'
import { Users } from './Pages/Users/Users'
import { Categories } from './Pages/Categories/Categories'
import { UserDetailed } from './Pages/Users/UserDetailed'
import { ExpenseAdd } from './Pages/Expenses/ExpenseAdd'
import { ExpenseDetailed } from './Pages/Expenses/ExpenseDetailed'
import { CategoryDetailed } from './Pages/Categories/CategoryDetailed'
import { ExpenseUpdate } from './Pages/Expenses/ExpenseUpdate'
import { ExpenseDelete } from './Pages/Expenses/ExpenseDelete'
import { ExpenseFilter } from './Pages/Expenses/ExpenseFilter'
import { CategoryAdd } from './Pages/Categories/CategoryAdd'

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
			<Route path='/expenses/:id/delete' element={<ExpenseDelete/>}></Route>
			<Route path='/expenses/filter' element={<ExpenseFilter/>}></Route>

			<Route path='/users' element={<Users/>}></Route>
			<Route path='/users/:id' element={<UserDetailed/>}></Route>
			
			<Route path='/categories' element={<Categories/>}></Route>
			<Route path='/categories/:id' element={<CategoryDetailed/>}></Route>
			<Route path='/categories/add' element={<CategoryAdd/>}></Route>
      	</Routes>
    </Box>
  )
}

export default App
