import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { AppBar, Button, Stack, Toolbar, Typography, styled } from '@mui/material'
import { Container } from '@mui/system';

const StyledToolbar = styled(Toolbar) ({
    display:"flex",
    justifyContent:"space-between"
})

const NavbarButton = styled(Button) ({
    color:"white"
})

export const Navbar = () => {
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
                }}>MoneyManager</Typography>
                <Container 
                    sx={{ flexGrow: 7}}
                >
                    <Stack direction="row" spacing={12}>
                        <NavbarButton variant='text'>Expenses</NavbarButton>
                        <NavbarButton variant='text'>Categories</NavbarButton>
                        <NavbarButton variant='text'>Users</NavbarButton>
                    </Stack>
                </Container>
            </StyledToolbar>
        </AppBar> 
    )
}