import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../constant/theme';
import { expenseCategories } from '../helpers/expenseCategories';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
    const formattedDate = expense.date ? new Date(expense.date).toLocaleDateString('en-GB') : 'N/A';
    const categoryData = expenseCategories.find((c) => c.id === expense.category) ||
        expenseCategories.find(c => c.id === 'others') || { id: 'others', label: 'Others', icon: { name: 'question', color: COLORS.GRAY }, bgColor: COLORS.CARD };

    return (
        <View style={styles.item}>
            <View style={styles.leftRow}>
                <View style={[styles.iconBox, { backgroundColor: categoryData.bgColor }]}>
                    <Icon
                        name={categoryData.icon.name}
                        size={18}
                        color={categoryData.iconColor || COLORS.GRAY}
                    />
                </View>
                <View style={styles.left}>
                    <Text style={styles.category} numberOfLines={2}>{expense.description || 'No description'}</Text>
                    <Text style={styles.desc}>{categoryData.label}</Text>
                </View>
            </View>
            <View style={styles.right}>
                <Text style={styles.amount}>₹{expense.amount ? expense.amount.toFixed(2) : '0.00'}</Text>
                <Text style={styles.date}>{formattedDate}</Text>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={onEdit}>
                        <Text style={styles.edit}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete}>
                        <Text style={styles.delete}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        marginVertical: 6,
        backgroundColor: COLORS.CARD,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%'
    },
    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '75%',
    },
    left: {
        marginLeft: 10,
        width: '80%',
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    category: {
        width: '100%',
        fontWeight: 'bold',
        fontSize: 14,
    },
    desc: {
        fontSize: 12,
        color: COLORS.GRAY,
    },
    right: {
        alignItems: 'flex-end',
        width: '25%'
    },
    amount: {
        fontSize: 14,
        color: COLORS.SUCCESS,
        fontWeight: '600',
    },
    date: {
        fontSize: 12,
        color: COLORS.GRAY,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 5,
    },
    edit: {
        fontSize: 12,
        color: COLORS.PRIMARY,
        marginRight: 10,
    },
    delete: {
        fontSize: 12,
        color: COLORS.DANGER,
    },
});

export default ExpenseItem;