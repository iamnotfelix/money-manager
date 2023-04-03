import { Box, Button, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField, Typography } from "@mui/material"
import * as React from 'react';
import { useState } from "react"
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../Models/Category";

export const ExpenseUpdate = () => {
    const params = useParams();

    const [amount, setAmount] = useState(0);
    const [paymentType, setPaymentType] = useState("Revolut");
    const [description, setDescription] = useState("");
    const [currency, setCurrency] = useState("Lei");
    const [date, setDate] = useState<Dayjs | null>(dayjs('2023-01-1'));

    const [loading, setLoading] = React.useState(false);
    const [categories, setAllCategories] = React.useState([]);
    const [checkedCategories, setChecked] = React.useState<Boolean[]>([]);

    const currencies = [ { value: 'Lei', label: 'Lei' }, { value: 'Euro', label: 'Euro' } ];
    const paymentTypes = [ { value:"Cash", label:"Cash" }, { value:"BT", label:"BT" }, { value:"Revolut", label:"Revolut" }, { value:"Alpha", label:"Alpha" } ];


    React.useEffect(() => {
        setLoading(true);

        const fetchCategories = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/api/categories`);
            const res = await data.json();
            setAllCategories(res);

            const tmp = new Array(res.length).fill(false);
            setChecked(tmp);
        }

        fetchCategories();

        setLoading(false);
    }, [params.id])

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const body = {
            amount: amount,
            paymentType: paymentType,
            description: description,
            currency: currency,
            date: date,
            expenseCategories: categories.filter((_, index) => {
                return checkedCategories[index]
            }).map((category: Category) => {
                return {
                    categoryId: category.id
                };
            })
        }
        const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/api/expenses/${params.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(body)
        });
        
        // TODO: Handle bad response

        navigate(`/expenses/${params.id}`);
    }

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        checkedCategories[parseInt(event.target.name)] = event.target.checked;
        setChecked(checkedCategories);
    };
    

    return (
        <Box>
            {loading && <Typography variant="h3" gutterBottom>Still loading...</Typography>}
            {!loading &&
            <FormGroup sx={{ display: "flex", alignItems: "center"}}>
                <TextField
                    type="number"
                    variant='outlined'
                    color='primary'
                    label="Amount"
                    onChange={e => setAmount(parseInt(e.target.value))}
                    fullWidth
                    value={amount}
                    required
                    sx={{m: 2, width: "25ch"}}
                />
                <TextField
                    select
                    label="Payment type"
                    defaultValue="Revolut"
                    helperText="Please select your payment type"
                    required
                    onChange={e => setPaymentType(e.target.value)}
                    sx={{m: 2, width: "25ch"}}
                >
                    {paymentTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Currency"
                    defaultValue="Lei"
                    required
                    onChange={e => setCurrency(e.target.value)}
                    helperText="Please select your currency"
                    sx={{m: 2, width: "25ch"}}
                >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    type="text"
                    variant='outlined'
                    color='primary'
                    label="Description"
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                    fullWidth
                    sx={{m: 2, width: "50ch"}}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField
                        label="Date"
                        variant='outlined'
                        color='primary'
                        value={date}
                        onChange={e => setDate(e)}
                        required
                        sx={{m: 2, width: "25ch"}}
                        />
                </LocalizationProvider>
                <FormGroup>
                    {categories?.map((category: Category, index) => (
                        <FormControlLabel key={index} control={<Checkbox onChange={handleCheckBoxChange} name={index.toString()}/>} label={category.name} />
                    ))}
                </FormGroup>
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Update</Button>
            </FormGroup>}
        </Box>
    );
}
