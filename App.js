import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import ExpenseTrackerScreen from './src/screens/ExpenseTrackerScreen';
import LoginScreen from './src/screens/LoginScreen';
import CustomToaster from './src/components/CustomToaster';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const options = {
    headerShown: false,
    animation: 'slide_from_right',
    fullScreenGestureEnabled: true,
  };
  console.log({ isAuthenticated });

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'ExpenseTrackerScreen' : 'Login'}
        screenOptions={options}
      >
        {isAuthenticated ? (
          <Stack.Screen name="ExpenseTrackerScreen" component={ExpenseTrackerScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
        <CustomToaster />
      </PersistGate>
    </Provider>
  );
};

export default App;