import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { AppBar, Button, Stack, Toolbar, Typography, styled } from '@mui/material'
import { Container } from '@mui/system';
import { Link } from 'react-router-dom'
import { useAuth } from './Hooks/useAuth';

const StyledToolbar = styled(Toolbar) ({
    display:"flex",
    justifyContent:"space-between"
})

const NavbarButton = styled(Button) ({
    color:"white"
})

const SimpleLink = styled(Link) ({
    color: 'inherit',
    padding: 0,
    margin: 0,
    textDecoration: 'none'
})

export const Navbar = () => {
    const { auth } = useAuth();

    return (
        <AppBar position="sticky">
            <StyledToolbar>
                <MonetizationOnIcon sx={{
                    display:{xs:"block", sm:"none"},
                    flexGrow: 1
                }}/>
                <Typography variant="h5" sx={{
                    display:{xs:"none", sm:"block"},
                    flexGrow: 1
                }}>
                    <SimpleLink to="/">MoneyManager</SimpleLink>
                </Typography>
                <Container 
                    sx={{ flexGrow: 7}}
                >
                    <Stack direction="row" spacing={4}>
                        <SimpleLink to="/expenses">
                            <NavbarButton variant='text'>Expenses</NavbarButton>
                        </SimpleLink>
                        <SimpleLink to="/expenses/filter">
                            <NavbarButton variant='text'>Expenses Filter</NavbarButton>
                        </SimpleLink>
                        <SimpleLink to="/categories">
                            <NavbarButton variant='text'>Categories</NavbarButton>
                        </SimpleLink>
                        <SimpleLink to={"/users"}>
                            <NavbarButton variant='text'>Users</NavbarButton>
                        </SimpleLink>
                        <SimpleLink to={"/incomes"}>
                            <NavbarButton variant='text'>Incomes</NavbarButton>
                        </SimpleLink>
                        <SimpleLink to={"/report"}>
                            <NavbarButton variant='text'>Statistical report</NavbarButton>
                        </SimpleLink>
                        {!auth &&
                        <SimpleLink to={"/register"}>
                            <NavbarButton variant='text'>Register</NavbarButton>
                        </SimpleLink>}
                        {!auth && 
                        <SimpleLink to={"/login"}>
                            <NavbarButton variant='text'>Login</NavbarButton>
                        </SimpleLink>}
                        {auth &&
                        <SimpleLink to={"/profile"}>
                            <NavbarButton variant='text'>Profile</NavbarButton>
                        </SimpleLink>}
                        {auth && 
                        <SimpleLink to={"/logout"}>
                            <NavbarButton variant='text'>Logout</NavbarButton>
                        </SimpleLink>}
                    </Stack>
                </Container>
            </StyledToolbar>
        </AppBar> 
    )
}