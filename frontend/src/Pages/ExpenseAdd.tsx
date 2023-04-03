import { Box, Button, FormGroup, MenuItem, TextField } from "@mui/material"
import * as React from 'react';
import { useState } from "react"
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { User } from "../Models/User";
import { useNavigate } from "react-router-dom";

export const ExpenseAdd = () => {
    const [amount, setAmount] = useState(0);
    const [paymentType, setPaymentType] = useState("Revolut");
    const [description, setDescription] = useState("");
    const [currency, setCurrency] = useState("Lei");
    const [date, setDate] = useState<Dayjs | null>(dayjs('2023-01-1'));
    const [userId, setUserId] = useState("");

    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = useState([]);

    const currencies = [ { value: 'Lei', label: 'Lei' }, { value: 'Euro', label: 'Euro' } ];
    const paymentTypes = [ { value:"Cash", label:"Cash" }, { value:"BT", label:"BT" }, { value:"Revolut", label:"Revolut" }, { value:"Alpha", label:"Alpha" } ];


    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch("http://localhost:5000/api/users");
            const users = await data.json();
            setUsers(users);
        }
        fetchData();
        setLoading(false);
    }, [])

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const body = {
            amount: amount,
            paymentType: paymentType,
            description: description,
            currency: currency,
            userId: userId,
            date: date
        }
        console.log(JSON.stringify(body))
        const response = await window.fetch("http://localhost:5000/api/expenses", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(body)
        });
        
        navigate("/expenses");

        console.log(response.ok);

        // //handle failure
        // const {data, errors} = await response.json()
        // if (response.ok) {
        //    
        // } else {
        //     const error = new Error(errors?.map(e => e.message).join('\n') ?? 'unknown')
        //     return Promise.reject(error)
        // }

        // console.log(amount, paymentType, description, currency, date?.toString(), userId) ;
    }

    return (
        <Box>
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
                <TextField
                    select
                    label="User"
                    // defaultValue=""
                    required
                    onChange={e => setUserId(e.target.value)}
                    // helperText="Please select your currency"
                    sx={{m: 2, width: "25ch"}}
                >
                    {users.map((option: User) => (
                        <MenuItem key={option.id} value={option.id}>
                        {option.username}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Add</Button>
            </FormGroup>
        </Box>
    );
}