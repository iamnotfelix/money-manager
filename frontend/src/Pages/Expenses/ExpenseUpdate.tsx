import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import * as React from 'react';
import { useState } from "react"
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../Models/Category";
import { Expense } from "../../Models/Expense";

export const ExpenseUpdate = () => {
    const params = useParams();

    const [amount, setAmount] = useState(0);
    const [paymentType, setPaymentType] = useState("");
    const [description, setDescription] = useState("");
    const [currency, setCurrency] = useState("");
    const [date, setDate] = useState<Dayjs | null>(dayjs('2023-01-1'));

    const [loading, setLoading] = React.useState(false);
    const [categories, setAllCategories] = React.useState([]);
    const [checkedCategories, setChecked] = React.useState<Boolean[]>([]);

    const currencies = [ { value: 'Lei', label: 'Lei' }, { value: 'Euro', label: 'Euro' } ];
    const paymentTypes = [ { value:"Cash", label:"Cash" }, { value:"BT", label:"BT" }, { value:"Revolut", label:"Revolut" }, { value:"Alpha", label:"Alpha" } ];


    React.useEffect(() => {
        setLoading(true);

        const fetchExpense = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/expenses/${params.id}`);
            const res = await data.json();
            const expense: Expense = res;
            setAmount(expense.amount);
            setPaymentType(expense.paymentType);
            setCurrency(expense.currency);
            setDescription(expense.description);
            setDate(dayjs(expense.date));
        }

        const fetchCategories = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories`);
            const res = await data.json();
            setAllCategories(res);

            const tmp = new Array(res.length).fill(false);
            setChecked(tmp);
        }

        fetchExpense();
        fetchCategories();

        setLoading(false);
    }, [params.id])

    const navigate = useNavigate();

    const [amountError, setAmountError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [dateError, setDateError] = useState(false);

    const [amountText, setAmountText] = useState("");
    const [descriptionText, setDescriptionText] = useState("");
    const [dateText, setDateText] = useState("");

    const validate = () => {
        let valid = true;
        
        setAmountError(false);
        setDescriptionError(false);
        setDateError(false);

        setAmountText("");
        setDescriptionText("MAX 250 characters");
        setDateText("");
        
        if (amount < 0) {
            setAmountError(true);
            setAmountText("Amount cannot be negative.");
            valid = false;
        }
        if (description.length > 250) {
            setDescriptionError(true);
            setDescriptionText("Description must be less than 250 characters.");
            valid = false;
        }
        if (description.length == 0) {
            setDescriptionError(true);
            setDescriptionText("Description cannot be empty.");
            valid = false;
        }

        return valid;
    }

    const handleSubmit = async () => {
        const valid = validate();

        if (!valid) {
            return;
        }

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
        const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/expenses/${params.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(body)
        });

        navigate(`/expenses/${params.id}`);
    }

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        checkedCategories[parseInt(event.target.name)] = event.target.checked;
        setChecked(checkedCategories);
    };
    

    return (
        <Box>
            {loading && <Stack alignItems="center" mt={4}><Typography variant="h3" gutterBottom>Still loading...</Typography></Stack>}
            {!loading &&
            <FormGroup sx={{ display: "flex", alignItems: "center"}}>
                <TextField
                    type="number"
                    variant='outlined'
                    color='primary'
                    label="Amount"
                    onChange={e => {
                        setAmount(parseInt(e.target.value));
                        setAmountError(false);
                        setAmountText("");
                    }}
                    error={amountError}
                    helperText={amountText}
                    fullWidth
                    value={amount}
                    required
                    sx={{m: 2, width: "25ch"}}
                />
                <TextField
                    select
                    label="Payment type"
                    value={paymentType}
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
                    value={currency}
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
                    onChange={e => {
                        setDescription(e.target.value);
                        setDescriptionError(false);
                        setDescriptionText("MAX 250 characters");
                    }}
                    error={descriptionError}
                    helperText={descriptionText}
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
                        onChange={e => {
                            setDate(e);
                            setDateError(false);
                            setDateText("");
                        }}
                        minDate={dayjs('2000-01-01')}
                        maxDate={dayjs('2100-01-01')}
                        onError={() => setDateText("Date must be between 01-01-2000 and 01-01-2100.")}
                        helperText={dateText}
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
