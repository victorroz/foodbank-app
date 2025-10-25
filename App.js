import React, { createContext, useContext, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

const ToastCtx = createContext({ show: (_m) => {} });
export const useToast = () => useContext(ToastCtx);

function ToastHost({ children }) {
  const [msg, setMsg] = useState('');
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 1800); };
  const value = useMemo(() => ({ show }), []);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      {msg ? <View style={styles.toast}><Text style={styles.toastTxt}>{msg}</Text></View> : null}
    </ToastCtx.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    zIndex: 999
  },
  toastTxt: { color: '#fff', fontWeight: '600' }
});


export default function App() {
  return (
    <SafeAreaProvider>
      <ToastHost>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ToastHost>
    </SafeAreaProvider>
  );
}
