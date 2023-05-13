import { Alert, AlertTitle, Stack } from "@mui/material";

export const Unauthorized = () => {
    return (
        <Stack alignItems="center" mt={4}>
            <Alert severity="warning">
                <AlertTitle>Permission denied</AlertTitle>
                You do not have permission to access this page.
            </Alert>
        </Stack>
    );
}