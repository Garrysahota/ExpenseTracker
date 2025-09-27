import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constant/theme';
import { expenseCategories } from '../helpers/expenseCategories';
import CustomToaster from './CustomToaster';

const ExpenseFormModal = ({ visible, onClose, onSubmit, initialData }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (initialData) {
            setDescription(initialData.description || '');
            setAmount(initialData.amount ? initialData.amount.toString() : '');
            setCategory(initialData.category || '');
            setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '');
        } else {
            setDescription('');
            setAmount('');
            setCategory('');
            setDate('');
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!description || !amount || !date || !category) {
            CustomToaster.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'All fields are required!',
            });
            return;
        }
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            CustomToaster.show({
                type: 'error',
                text1: 'Invalid Amount',
                text2: 'Amount must be a valid positive number',
            });
            return;
        }
        try {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid date');
            }
            onSubmit({ description, amount: parsedAmount, category, date: parsedDate.toISOString() });
            setDescription('');
            setAmount('');
            setCategory('');
            setDate('');
            onClose();
        } catch (error) {
            CustomToaster.show({
                type: 'error',
                text1: 'Invalid Date',
                text2: 'Please enter a valid date (YYYY-MM-DD)',
            });
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.container}>

                <View style={styles.form}>

                    <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                        <Text style={styles.btntext}>x</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>{initialData ? 'Edit Expense' : 'Add Expense'}</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Title"
                            value={description}
                            onChangeText={setDescription}
                            keyboardType='default'
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue) => setCategory(itemValue)}
                            style={[styles.input,]}
                        >
                            <Picker.Item label="Select Category" value="" />
                            {expenseCategories.map((item) => (
                                <Picker.Item key={item?.id} label={item?.label} value={item?.id} />
                            ))}
                        </Picker>

                    </View>
                    <View style={styles.inputContainer}>

                        <TextInput
                            placeholder="Date (YYYY-MM-DD)"
                            value={date}
                            onChangeText={setDate}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
                            <Text style={styles.btntext}>Save</Text>
                        </TouchableOpacity>


                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.TRANSPERENT,
    },
    form: {
        width: '80%',
        padding: 20,
        backgroundColor: COLORS.WHITE,
        borderRadius: 10,
        gap: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.BLACK,
    },
    inputContainer: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: COLORS.GRAY,
        borderRadius: 5,
        // paddingHorizontal: 10,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    input: {
        borderColor: COLORS.GRAY,
        color: COLORS.BLACK,
        paddingHorizontal: 10
        // padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    saveButton: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.PRIMARY
    },
    cancelButton: {
        width: 40,
        height: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BLACK,
        position: 'absolute',
        top: -15,
        right: -15
    },
    btntext: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontWeight: 'bold'
    }
});

export default ExpenseFormModal;