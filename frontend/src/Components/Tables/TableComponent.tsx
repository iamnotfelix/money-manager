import { TableContainer, Paper, Table } from "@mui/material";

export const TableComponenet = (props: any) => {
    return (
        <TableContainer component={Paper} sx={{ minWidth: 1100 }}>
            <Table aria-label="simple table">
                {props.children}
            </Table>
        </TableContainer>
    );
}