import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../constant/config';
import { handleError } from '../../helpers/handleError';

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        console.log('here inside of login', { email, password });

        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        console.log('response of login from auth:', response);

        return response?.data;
    } catch (error) {
        return rejectWithValue(handleError(error, 'Login failed'));
    }
});


export const logout = createAsyncThunk('auth/logout', async () => {
    return true;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        }).addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }).addCase(logout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        });
    },
});

export default authSlice.reducer;