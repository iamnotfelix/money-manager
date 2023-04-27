import { Stack, IconButton } from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


export const TableNavigator = (props: any) => {
    const { handleClickPrevious, handleClickNext, previousDisabled, nextDisabled, ...other } = props;

    return (
        <Stack direction='row' justifyContent="center" m={4}>
				<IconButton size="large" onClick={handleClickPrevious} disabled={previousDisabled}>
                    <KeyboardArrowLeftIcon fontSize="large"/>
                </IconButton>
				<IconButton size="large" onClick={handleClickNext} disabled={nextDisabled}>
                    <KeyboardArrowRightIcon fontSize="large"/>
                </IconButton>
        </Stack>
    );
} 