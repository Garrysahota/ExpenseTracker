import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../constant/theme';
import ExpenseItem from '../components/ExpenseItem';
import ExpenseFormModal from '../components/ExpenseFormModal';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../redux/features/expensesSlice';
import { logout } from '../redux/features/authSlice';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ExpenseTrackerScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { items: expenses, loading, error } = useSelector(state => state.expenses);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        dispatch(fetchExpenses());
    }, [dispatch]);

    const handleAddExpense = (expense) => {
        dispatch(createExpense(expense));
        setModalVisible(false);
    };

    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setModalVisible(true);
    };

    const handleUpdateExpense = (updatedExpense) => {
        dispatch(updateExpense({ id: editingExpense._id, expense: updatedExpense }));
        setEditingExpense(null);
        setModalVisible(false);
    };

    const handleDeleteExpense = (id) => {
        dispatch(deleteExpense(id));
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.headerContainer}>
                <View style={styles.profileContainer}>
                    <View style={{ borderWidth: 1, borderColor: COLORS.PRIMARY, borderRadius: 40, width: 40, height: 40, backgroundColor: COLORS.PLACEHOLDER }}>
                        <Image
                            source={{ uri: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=' }}
                            style={{ width: '100%', height: '100%', borderRadius: 40 }}
                        />
                    </View>
                </View>
                <View style={styles.headerTxtContainer}>
                    <Text style={styles.text16}>Expense Tracker</Text>
                </View>
                <TouchableOpacity style={styles.rightSide} onPress={handleLogout}>
                    <Text style={styles.text16}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={styles.transactionsHeader}>
                    <Text style={styles.text16}>Recent Transactions</Text>
                </View>
                {loading ?
                    <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loading} />
                    :
                    <>
                        <FlatList
                            data={expenses}
                            renderItem={({ item }) => (
                                <ExpenseItem
                                    expense={item}
                                    onEdit={() => handleEditExpense(item)}
                                    onDelete={() => handleDeleteExpense(item._id)}
                                />
                            )}
                            keyExtractor={item => item._id || `key-${Math.random()}`}
                            ListEmptyComponent={<Text style={styles.emptyText}>No expenses found</Text>}
                        />
                        <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
                            <Icon name="plus" size={24} color={COLORS.WHITE} />
                        </TouchableOpacity>
                        <ExpenseFormModal
                            visible={modalVisible}
                            onClose={() => {
                                setModalVisible(false);
                                setEditingExpense(null);
                            }}
                            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                            initialData={editingExpense}
                        />
                    </>
                }
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    headerContainer: {
        height: 60,
        width: '100%',
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileContainer: {
        width: '20%',
        height: '100%',
        justifyContent: 'center',
    },
    headerTxtContainer: {
        width: '60%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightSide: {
        width: '20%',
        alignItems: 'flex-end',
    },
    container: {
        flex: 1,
        paddingHorizontal: 18,
        paddingVertical: 15,
    },
    transactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    text16: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.BLACK,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    loading: {
        marginVertical: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.GRAY,
        marginTop: 20,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.PRIMARY,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});

export default ExpenseTrackerScreen;