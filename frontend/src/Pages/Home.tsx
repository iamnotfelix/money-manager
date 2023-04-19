import { Container, Stack, Typography } from "@mui/material";

export const Home = () => {
    return (
        <Container>
        <Stack alignItems="center" mt={4}>
            <Typography variant="h1">Home</Typography>
        </Stack>
        <Stack alignItems="center" mt={4}>
            {/* <Typography variant="h3">
                *project description*
            </Typography> */}
        </Stack>
        </Container>
    );
}