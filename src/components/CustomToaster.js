import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import { COLORS } from '../constant/theme';

const CustomToaster = () => {
    return (
        <Toast
            config={{
                success: ({ text1, text2, ...rest }) => (
                    <View style={[styles.toast, { backgroundColor: COLORS.SUCCESS }]}>
                        {/* <Text style={styles.text1}>{text1}</Text> */}
                        <Text style={styles.text2}>{text2}</Text>
                    </View>
                ),
                error: ({ text1, text2, ...rest }) => (
                    <View style={[styles.toast, { backgroundColor: COLORS.DANGER }]}>
                        {/* <Text style={styles.text1}>{text1}</Text> */}
                        <Text style={styles.text2}>{text2}</Text>
                    </View>
                ),
                info: ({ text1, text2, ...rest }) => (
                    <View style={[styles.toast, { backgroundColor: COLORS.INFO }]}>
                        {/* <Text style={styles.text1}>{text1}</Text> */}
                        <Text style={styles.text2}>{text2}</Text>
                    </View>
                ),
            }}
            position="bottom"
            bottomOffset={20}
            visibilityTime={4000}
            autoHide={true}
        />
    );
};

const styles = StyleSheet.create({
    toast: {
        width: '90%',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        // alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    text1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    text2: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
    },
});

export default CustomToaster;

CustomToaster.show = Toast.show;