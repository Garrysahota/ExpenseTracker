import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constant/theme';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/features/authSlice';

const LoginScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('test700@gmail.com');
    const [password, setPassword] = useState('password@123');
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);

    console.log('login error:', error);

    const handleLogin = async () => {
        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            navigation.navigate('ExpenseTrackerScreen');
        }
    };


    return (
        <SafeAreaView style={styles.root}>

            <View style={styles.container}>
                <Text style={styles.title}>Sign In</Text>
                <Text style={styles.subtitle}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>


                <View style={styles.inputSection}>
                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>
                    {/* {error && <Text style={styles.error}>{error}</Text>} */}
                </View>

                <View style={styles.inputSection}>
                    <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={() => handleLogin()} disabled={loading}>
                        {loading ?
                            <ActivityIndicator size={'small'} color={COLORS.WHITE} />
                            : <Text style={[styles.text14, { color: COLORS.WHITE }]}>Login</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND
    },
    container: {
        marginTop: 150,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18
    },
    title: {
        color: COLORS.TEXT,
        fontSize: 30,
        fontWeight: 'bold'
    },
    subtitle: {
        color: COLORS.TEXT,
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
        opacity: 0.6,
        lineHeight: 16,
        marginVertical: 10
    },
    inputSection: {
        width: '100%',
        gap: 15,
        marginTop: 30
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: COLORS.GRAY,
        width: '100%',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    label: {
        color: COLORS.TEXT,
        fontWeight: '800',
        fontSize: 13
    },
    text14: {
        color: COLORS.TEXT,
        fontWeight: 'bold',
        fontSize: 14
    },
    button: {
        backgroundColor: COLORS.PRIMARY,
        width: '100%',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        fontSize: 12,
        textAlign: 'left',
        color: COLORS.DANGER
    }
});