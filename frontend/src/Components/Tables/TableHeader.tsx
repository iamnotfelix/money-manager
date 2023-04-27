import { TableHead, TableRow, TableCell } from "@mui/material";

export const TableHeader = (props: any) => {
    const { header, ...other } = props;
    
    return (
        <TableHead>
            <TableRow>
                {header.map((name: string, index: any) => {
                    return <TableCell key={index} align="center">{name}</TableCell>
                })}
                {props.children}
            </TableRow>
        </TableHead>
    );
}