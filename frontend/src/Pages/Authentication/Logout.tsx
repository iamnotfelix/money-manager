import { Stack, Alert, AlertTitle } from "@mui/material";

export const Logout = () => {
    return (
        <Stack alignItems="center" mt={4}>
            <Alert severity="warning">
                <AlertTitle>About to logout</AlertTitle>
                Will log out soon.
            </Alert>
        </Stack>
    );
}