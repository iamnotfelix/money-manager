import { TableBody, TableRow, TableCell, Typography } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import { SimpleLink } from "../SimpleLink";

export const TableContent = (props: any) => {
    const { content, contentKeys, detailsLink, hasUser, ...other } = props;

    return (
        <TableBody>
        {content.map((row: any, index: any) => (
            <TableRow key={index}> 
                <TableCell align="left" key={"index" + index.toString()}>{index + 1}</TableCell>
                {contentKeys.map((k: string) => (
                    <TableCell align="center" key={k + index.toString()}>{row[k]}</TableCell>
                ))}
                {hasUser &&
                <TableCell align="center" key={"username" + index.toString()}>
                    <SimpleLink to={`/users/${row.user.id}`}> <Typography color="secondary">{row.user.username}</Typography></SimpleLink>
                </TableCell>}
                <TableCell>
                    <SimpleLink to={detailsLink + `/${row["id"]}`}><CreateIcon/></SimpleLink>
                </TableCell>
            </TableRow>
        ))}
        </TableBody>
    );
}