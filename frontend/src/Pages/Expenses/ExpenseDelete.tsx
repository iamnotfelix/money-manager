import { Container, Card, CardContent, IconButton, CardActions, Button, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const ExpenseDelete = () => {
	const params = useParams();
	const navigate = useNavigate();

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
        const response = fetch(`http://localhost:5000/api/expenses/${params.id}`,{
            method: 'DELETE',
            mode: 'cors'
        });
		navigate("/expenses");
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate(`/expenses/${params.id}`);
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/expenses/${params.id}`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<Typography variant="h5">Are you sure you want to delete this expense?</Typography>
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};