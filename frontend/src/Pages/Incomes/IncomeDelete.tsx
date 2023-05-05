import { Container, Card, CardContent, IconButton, CardActions, Button, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const IncomeDelete = () => {
	const params = useParams();
	const navigate = useNavigate();

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
        const response = fetch(import.meta.env.VITE_REACT_API_BACKEND + `/incomes/${params.id}`,{
            method: 'DELETE',
            mode: 'cors'
        });
		navigate("/incomes");
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate(`/incomes/${params.id}`);
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/incomes/${params.id}`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<Typography variant="h5">Are you sure you want to delete this income?</Typography>
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};