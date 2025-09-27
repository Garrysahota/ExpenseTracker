import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../constant/config';
import { handleError } from '../../helpers/handleError';
import CustomToaster from '../../components/CustomToaster';

export const fetchExpenses = createAsyncThunk('expenses/fetch', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const response = await axios.get(`${API_URL}/expenses`, {
            headers: { Authorization: `Bearer ${auth.token}` },
        });
        return response.data.data || [];
    } catch (error) {
        return rejectWithValue(handleError(error, 'Failed to fetch expenses'));
    }
});

export const createExpense = createAsyncThunk('expenses/add', async (expense, { getState, rejectWithValue, dispatch }) => {
    try {
        const { auth } = getState();
        const normalizedExpense = {
            ...expense,
            category: typeof expense.category === 'string' ? expense.category.toLowerCase() : expense.category,
        };
        dispatch(optimisticAddExpense(normalizedExpense));
        const response = await axios.post(`${API_URL}/expenses`, normalizedExpense, {
            headers: { Authorization: `Bearer ${auth.token}` },
        });
        CustomToaster.show({ type: 'success', text1: 'Success', text2: 'Expense added successfully' });
        return response.data.data;
    } catch (error) {
        dispatch(revertOptimisticAdd(normalizedExpense._id));
        return rejectWithValue(handleError(error, 'Failed to add expense'));
    }
});

export const updateExpense = createAsyncThunk('expenses/update', async ({ id, expense }, { getState, rejectWithValue, dispatch }) => {
    try {
        const { auth } = getState();
        const normalizedExpense = {
            ...expense,
            category: typeof expense.category === 'string' ? expense.category.toLowerCase() : expense.category,
        };
        dispatch(optimisticUpdateExpense({ ...normalizedExpense, _id: id }));
        const response = await axios.put(`${API_URL}/expenses/${id}`, normalizedExpense, {
            headers: { Authorization: `Bearer ${auth.token}` },
        });
        CustomToaster.show({
            type: 'success',
            text1: 'Success',
            text2: 'Expense updated successfully',
        });
        return response.data.data;
    } catch (error) {
        dispatch(revertOptimisticUpdate({ _id: id, original }));
        return rejectWithValue(handleError(error, 'Failed to update expense'));
    }
});

export const deleteExpense = createAsyncThunk('expenses/delete', async (id, { getState, rejectWithValue, dispatch }) => {
    try {
        const { auth } = getState();
        dispatch(optimisticDeleteExpense(id));
        await axios.delete(`${API_URL}/expenses/${id}`, {
            headers: { Authorization: `Bearer ${auth.token}` },
        });
        CustomToaster.show({
            type: 'success',
            text1: 'Success',
            text2: 'Expense deleted successfully',
        });
        return id;
    } catch (error) {
        return rejectWithValue(handleError(error, 'Failed to delete expense'));
    }
});

const expensesSlice = createSlice({
    name: 'expenses',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        optimisticAddExpense: (state, action) => {
            state.items.unshift({ ...action.payload, _id: action.payload?._id });
        },
        optimisticUpdateExpense: (state, action) => {
            const index = state.items.findIndex((e) => e._id === action.payload?._id);
            if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
        },
        optimisticDeleteExpense: (state, action) => {
            state.items = state.items.filter((e) => e._id !== action.payload);
        },
        revertOptimisticAdd: (state, action) => {
            state.items = state.items.filter((e) => e._id !== action.payload);
        },
        revertOptimisticUpdate: (state, action) => {
            const index = state.items.findIndex((e) => e._id === action.payload?._id);
            if (index !== -1 && action.payload.original) state.items[index] = action.payload.original;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((e) => e._id.startsWith('temp-'));
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.unshift(action.payload);
                }
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((e) => e._id === action.payload?._id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((e) => e._id !== action.payload);
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    optimisticAddExpense,
    optimisticUpdateExpense,
    optimisticDeleteExpense,
    revertOptimisticAdd,
    revertOptimisticUpdate,
} = expensesSlice.actions;

export default expensesSlice.reducer;