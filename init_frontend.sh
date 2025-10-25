#!/usr/bin/env bash
set -euo pipefail

# Create folders
mkdir -p assets
mkdir -p src/{components,navigation,screens/register,store,utils}

# ---------------- app.json (adds permissions + extra env) ----------------
cat > app.json << 'EOF'
{
  "expo": {
    "name": "FoodBank",
    "slug": "foodbank-app",
    "scheme": "foodbank",
    "platforms": ["ios", "android", "web"],
    "orientation": "portrait",
    "splash": { "image": "./assets/splash.png", "resizeMode": "contain", "backgroundColor": "#ffffff" },
    "icon": "./assets/icon.png",
    "ios": {
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "We need camera access to capture your ID and selfie for verification.",
        "NSPhotoLibraryAddUsageDescription": "We use the photo library to upload ID images.",
        "NSLocationWhenInUseUsageDescription": "We use your location to autofill city and validate local eligibility."
      }
    },
    "android": { "permissions": ["CAMERA", "READ_EXTERNAL_STORAGE", "ACCESS_FINE_LOCATION"] },
    "extra": {
      "API_BASE_URL": "http://localhost:4000",
      "MOCK_MODE": true
    }
  }
}
EOF

# ---------------- App.js ----------------
cat > App.js << 'EOF'
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
  toast: { position:'absolute', bottom:30, left:20, right:20, padding:12, borderRadius:10, backgroundColor:'#111', alignItems:'center', zIndex: 999 },
  toastTxt: { color:'#fff', fontWeight:'600' }
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
EOF

# ---------------- navigation/AppNavigator.js ----------------
cat > src/navigation/AppNavigator.js << 'EOF'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import DashboardScreen from '../screens/DashboardScreen';

import AccountInfoScreen from '../screens/register/AccountInfoScreen';
import VerifyContactScreen from '../screens/register/VerifyContactScreen';
import GovIdScreen from '../screens/register/GovIdScreen';
import SelfieScreen from '../screens/register/SelfieScreen';
import AddressScreen from '../screens/register/AddressScreen';
import ConsentScreen from '../screens/register/ConsentScreen';
import ReviewSubmitScreen from '../screens/register/ReviewSubmitScreen';

const Root = createNativeStackNavigator();
const Register = createNativeStackNavigator();

function RegisterNavigator() {
  return (
    <Register.Navigator screenOptions={{ headerBackTitle: 'Back' }}>
      <Register.Screen name="AccountInfo" component={AccountInfoScreen} options={{ title: 'Create Account' }} />
      <Register.Screen name="VerifyContact" component={VerifyContactScreen} options={{ title: 'Verify Contact' }} />
      <Register.Screen name="GovId" component={GovIdScreen} options={{ title: 'Government ID' }} />
      <Register.Screen name="Selfie" component={SelfieScreen} options={{ title: 'Selfie Match' }} />
      <Register.Screen name="Address" component={AddressScreen} options={{ title: 'Address' }} />
      <Register.Screen name="Consent" component={ConsentScreen} options={{ title: 'Consent' }} />
      <Register.Screen name="ReviewSubmit" component={ReviewSubmitScreen} options={{ title: 'Review & Submit' }} />
    </Register.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Root.Navigator>
      <Root.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Root.Screen name="RegisterFlow" component={RegisterNavigator} options={{ headerShown: false }} />
      <Root.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
    </Root.Navigator>
  );
}
EOF

# ---------------- components ----------------
cat > src/components/PrimaryButton.js << 'EOF'
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
export default function PrimaryButton({ title, onPress, disabled }) {
  return (
    <TouchableOpacity style={[styles.btn, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center', marginVertical: 8 },
  disabled: { opacity: 0.5 },
  txt: { color: '#00310f', fontWeight: '700', fontSize: 16 }
});
EOF

cat > src/components/FormTextInput.js << 'EOF'
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
export default function FormTextInput({ label, error, ...props }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput style={[styles.input, !!error && styles.errorBorder]} placeholderTextColor="#9aa0a6" {...props} />
      {!!error && <Text style={styles.err}>{error}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  errorBorder: { borderColor: colors.danger },
  err: { color: colors.danger, marginTop: 4 }
});
EOF

cat > src/components/StepProgressBar.js << 'EOF'
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
export default function StepProgressBar({ step, total = 7 }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        return <View key={idx} style={[styles.dot, idx <= step ? styles.active : styles.inactive]} />;
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, marginVertical: 10 },
  dot: { flex: 1, height: 6, borderRadius: 3 },
  active: { backgroundColor: colors.primary },
  inactive: { backgroundColor: '#e5e5e5' }
});
EOF

cat > src/components/LoadingOverlay.js << 'EOF'
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
export default function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <View style={styles.backdrop}>
      <ActivityIndicator size="large" />
    </View>
  );
}
const styles = StyleSheet.create({
  backdrop: { position: 'absolute', left:0, right:0, top:0, bottom:0, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.15)', zIndex: 999 }
});
EOF

# ---------------- theme.js ----------------
cat > src/theme.js << 'EOF'
export const colors = { primary: '#0F6', text: '#111', danger: '#e33', border: '#ddd' };
export const fonts = {
  h1: { fontSize: 28, fontWeight: '800' },
  h2: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 16 }
};
export const spacing = (n = 1) => n * 8;
EOF

# ---------------- store ----------------
cat > src/store/registrationStore.js << 'EOF'
import { create } from 'zustand';

const initial = {
  firstName: '', lastName: '', email: '', phone: '', password: '',
  dob: '', householdSize: '',
  userId: '',
  otp: '',
  govIdUri: '', selfieUri: '',
  address1: '', city: '', province: '', postalCode: '',
  consentMarketing: false, consentData: false
};

const useRegistrationStore = create((set) => ({
  data: { ...initial },
  setField: (key, value) => set((state) => ({ data: { ...state.data, [key]: value } })),
  reset: () => set({ data: { ...initial } })
}));

export default useRegistrationStore;
EOF

# ---------------- utils: validation & api ----------------
cat > src/utils/validation.js << 'EOF'
import * as Yup from 'yup';

export const accountSchema = Yup.object().shape({
  firstName: Yup.string().min(2).required('Required'),
  lastName: Yup.string().min(2).required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().matches(/^[0-9+\-\s()]{7,}$/, 'Invalid phone').required('Required'),
  password: Yup.string().min(6).required('Required'),
  dob: Yup.string().required('Required'),
  householdSize: Yup.number().min(1).required('Required')
});

export const otpSchema = Yup.object().shape({
  otp: Yup.string().length(6, '6 digits').required('Required')
});

export const addressSchema = Yup.object().shape({
  address1: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  province: Yup.string().required('Required'),
  postalCode: Yup.string().matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid').required('Required')
});
EOF

cat > src/utils/api.contract.js << 'EOF'
export const Contract = {
  step1: { method: 'POST', path: '/auth/register/step1' },
  sendOtp: { method: 'POST', path: '/auth/otp/send' },
  verifyOtp: { method: 'POST', path: '/auth/otp/verify' },
  location: { method: 'POST', path: '/auth/register/location' },
  docs: { method: 'POST', path: '/auth/register/docs' }
};
EOF

cat > src/utils/api.js << 'EOF'
import axios from 'axios';
import Constants from 'expo-constants';

const baseURL = Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:4000';
const MOCK = !!Constants.expoConfig?.extra?.MOCK_MODE;

export const api = axios.create({ baseURL, timeout: 10000 });

// --- MOCKS that mirror FoodBank_LocalLink_Schema_v1 ---
const delay = (ms) => new Promise(r => setTimeout(r, ms));

export const registerStep1 = async (payload) => {
  if (MOCK) { await delay(300); return { data: { userId: 'mock123', status: 'pending' } }; }
  return api.post('/auth/register/step1', payload);
};

export const sendOtp = async ({ phone }) => {
  if (MOCK) { await delay(200); return { data: { ok: true, devCode: '123456' } }; }
  return api.post('/auth/otp/send', { phone });
};

export const verifyOtp = async ({ userId, code }) => {
  if (MOCK) { await delay(200); return { data: { phoneVerifiedAt: new Date().toISOString() } }; }
  return api.post('/auth/otp/verify', { userId, code });
};

export const registerLocation = async ({ userId, geo }) => {
  if (MOCK) { await delay(200); return { data: { inCity: true, city: 'Regina', province: 'SK', country: 'CA' } }; }
  return api.post('/auth/register/location', { userId, geo });
};

export const uploadDocs = async (formData) => {
  if (MOCK) { await delay(400); return { data: { verified: false } }; }
  return api.post('/auth/register/docs', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const completeRegistration = async (userData) => {
  // helper for demo
  const step1 = await registerStep1(userData);
  await sendOtp({ phone: userData.phone });
  await verifyOtp({ userId: step1.data.userId, code: '123456' });
  await registerLocation({ userId: step1.data.userId, geo: { type:'Point', coordinates: [-104.6189, 50.4452] } });
  const fd = new FormData();
  if (userData.govIdUri) fd.append('idFront', { uri: userData.govIdUri, name:'id.jpg', type:'image/jpeg' });
  if (userData.selfieUri) fd.append('selfie', { uri: userData.selfieUri, name:'selfie.jpg', type:'image/jpeg' });
  await uploadDocs(fd);
  return { data: { ok: true, userId: step1.data.userId, status: 'pending' } };
};
EOF

# ---------------- screens: Welcome & Dashboard ----------------
cat > src/screens/WelcomeScreen.js << 'EOF'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { fonts } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.wrap}>
      <Text style={[fonts.h1, styles.h1]}>Regina FoodBank</Text>
      <Text style={styles.p}>Register to access local hampers, hours, and donation pickup slots.</Text>
      <PrimaryButton title="Get Started" onPress={() => navigation.navigate('RegisterFlow')} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 20 },
  h1: { marginBottom: 10 },
  p: { color: '#444', marginBottom: 20 }
});
EOF

cat > src/screens/DashboardScreen.js << 'EOF'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../theme';

export default function DashboardScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={[fonts.h2, styles.h2]}>Welcome!</Text>
      <Text>Your registration is being verified. Local services will appear here.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  h2: { marginBottom: 8 }
});
EOF

# ---------------- register screens ----------------
cat > src/screens/register/AccountInfoScreen.js << 'EOF'
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';
import { accountSchema } from '../../utils/validation';
import { registerStep1, sendOtp } from '../../utils/api';

export default function AccountInfoScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();
  return (
    <View style={styles.wrap}>
      <StepProgressBar step={1} />
      <Formik
        initialValues={{
          firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone, password: data.password,
          dob: data.dob, householdSize: String(data.householdSize || '')
        }}
        validationSchema={accountSchema}
        onSubmit={async (values) => {
          Object.entries(values).forEach(([k, v]) => setField(k, v));
          const res = await registerStep1({ ...values, householdSize: Number(values.householdSize), role: 'recipient' });
          setField('userId', res.data.userId);
          await sendOtp({ phone: values.phone });
          navigation.navigate('VerifyContact');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <FormTextInput label="First Name" value={values.firstName} onChangeText={handleChange('firstName')} onBlur={handleBlur('firstName')} error={touched.firstName && errors.firstName} />
            <FormTextInput label="Last Name" value={values.lastName} onChangeText={handleChange('lastName')} onBlur={handleBlur('lastName')} error={touched.lastName && errors.lastName} />
            <FormTextInput label="Email" keyboardType="email-address" autoCapitalize="none" value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} error={touched.email && errors.email} />
            <FormTextInput label="Phone" keyboardType="phone-pad" value={values.phone} onChangeText={handleChange('phone')} onBlur={handleBlur('phone')} error={touched.phone && errors.phone} />
            <FormTextInput label="Password" secureTextEntry value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} error={touched.password && errors.password} />
            <FormTextInput label="Date of Birth (YYYY-MM-DD)" value={values.dob} onChangeText={handleChange('dob')} onBlur={handleBlur('dob')} error={touched.dob && errors.dob} />
            <FormTextInput label="Household Size" keyboardType="number-pad" value={values.householdSize} onChangeText={handleChange('householdSize')} onBlur={handleBlur('householdSize')} error={touched.householdSize && errors.householdSize} />
            <PrimaryButton title="Continue" onPress={handleSubmit} disabled={!isValid} />
          </>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 } });
EOF

cat > src/screens/register/VerifyContactScreen.js << 'EOF'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import StepProgressBar from '../../components/StepProgressBar';
import PrimaryButton from '../../components/PrimaryButton';
import FormTextInput from '../../components/FormTextInput';
import { otpSchema } from '../../utils/validation';
import useRegistrationStore from '../../store/registrationStore';
import { verifyOtp } from '../../utils/api';

export default function VerifyContactScreen({ navigation }) {
  const { data } = useRegistrationStore();
  return (
    <View style={styles.wrap}>
      <StepProgressBar step={2} />
      <Text style={styles.p}>We sent a 6-digit code to {data.phone || data.email}.</Text>
      <Formik
        initialValues={{ otp: '' }}
        validationSchema={otpSchema}
        onSubmit={async (values) => {
          await verifyOtp({ userId: data.userId, code: values.otp || '123456' });
          navigation.navigate('GovId');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <FormTextInput label="Enter Code" keyboardType="number-pad" maxLength={6}
              value={values.otp} onChangeText={handleChange('otp')} onBlur={handleBlur('otp')}
              error={touched.otp && errors.otp} />
            <PrimaryButton title="Verify & Continue" onPress={handleSubmit} disabled={!isValid} />
          </>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 }, p: { marginBottom: 12 } });
EOF

cat > src/screens/register/GovIdScreen.js << 'EOF'
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';

export default function GovIdScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!res.canceled) setField('govIdUri', res.assets[0].uri);
  };

  const takePhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled) setField('govIdUri', res.assets[0].uri);
  };

  return (
    <View style={styles.wrap}>
      <StepProgressBar step={3} />
      {!!data.govIdUri && <Image source={{ uri: data.govIdUri }} style={styles.preview} />}
      <PrimaryButton title="Take Photo of ID" onPress={takePhoto} />
      <PrimaryButton title="Upload from Library" onPress={pickImage} />
      <PrimaryButton title="Continue" onPress={() => navigation.navigate('Selfie')} disabled={!data.govIdUri} />
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 }, preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 } });
EOF

cat > src/screens/register/SelfieScreen.js << 'EOF'
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';

export default function SelfieScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();

  const takeSelfie = async () => {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7, cameraType: 'front' });
    if (!res.canceled) setField('selfieUri', res.assets[0].uri);
  };

  return (
    <View style={styles.wrap}>
      <StepProgressBar step={4} />
      {!!data.selfieUri && <Image source={{ uri: data.selfieUri }} style={styles.preview} />}
      <PrimaryButton title="Take Selfie" onPress={takeSelfie} />
      <PrimaryButton title="Continue" onPress={() => navigation.navigate('Address')} disabled={!data.selfieUri} />
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 }, preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 } });
EOF

cat > src/screens/register/AddressScreen.js << 'EOF'
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';
import { addressSchema } from '../../utils/validation';
import { registerLocation } from '../../utils/api';

export default function AddressScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();

  return (
    <View style={styles.wrap}>
      <StepProgressBar step={5} />
      <Formik
        initialValues={{ address1: data.address1, city: data.city || 'Regina', province: data.province || 'SK', postalCode: data.postalCode }}
        validationSchema={addressSchema}
        onSubmit={async (values) => {
          Object.entries(values).forEach(([k,v]) => setField(k, v));
          await registerLocation({ userId: data.userId, geo: { type:'Point', coordinates: [-104.6189, 50.4452] } });
          navigation.navigate('Consent');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <FormTextInput label="Address" value={values.address1} onChangeText={handleChange('address1')} onBlur={handleBlur('address1')} error={touched.address1 && errors.address1} />
            <FormTextInput label="City" value={values.city} onChangeText={handleChange('city')} onBlur={handleBlur('city')} error={touched.city && errors.city} />
            <FormTextInput label="Province" value={values.province} onChangeText={handleChange('province')} onBlur={handleBlur('province')} error={touched.province && errors.province} />
            <FormTextInput label="Postal Code" autoCapitalize="characters" value={values.postalCode} onChangeText={handleChange('postalCode')} onBlur={handleBlur('postalCode')} error={touched.postalCode && errors.postalCode} />
            <PrimaryButton title="Continue" onPress={handleSubmit} disabled={!isValid} />
          </>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 } });
EOF

cat > src/screens/register/ConsentScreen.js << 'EOF'
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';
import { fonts } from '../../theme';

export default function ConsentScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();
  const [consentData, setConsentData] = useState(!!data.consentData);
  const [consentMarketing, setConsentMarketing] = useState(!!data.consentMarketing);

  const onNext = () => {
    setField('consentData', consentData);
    setField('consentMarketing', consentMarketing);
    if (!consentData) return alert('Please accept the Data Consent to continue.');
    navigation.navigate('ReviewSubmit');
  };

  return (
    <View style={styles.wrap}>
      <StepProgressBar step={6} />
      <Text style={[fonts.h2, { marginBottom: 12 }]}>Consents</Text>
      <View style={styles.row}>
        <Text style={styles.label}>I agree to data processing for eligibility & verification</Text>
        <Switch value={consentData} onValueChange={setConsentData} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>I agree to receive program updates (optional)</Text>
        <Switch value={consentMarketing} onValueChange={setConsentMarketing} />
      </View>
      <PrimaryButton title="Continue" onPress={onNext} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  label: { flex: 1, marginRight: 12 }
});
EOF

cat > src/screens/register/ReviewSubmitScreen.js << 'EOF'
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';
import { completeRegistration } from '../../utils/api';
import LoadingOverlay from '../../components/LoadingOverlay';
import { fonts } from '../../theme';

export default function ReviewSubmitScreen({ navigation }) {
  const { data, reset } = useRegistrationStore();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await completeRegistration({ ...data });
      reset();
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (e) {
      alert('Submit failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <LoadingOverlay visible={loading} />
      <StepProgressBar step={7} />
      <Text style={[fonts.h2, { marginBottom: 10 }]}>Review</Text>
      <Text>Name: {data.firstName} {data.lastName}</Text>
      <Text>Email: {data.email}</Text>
      <Text>Phone: {data.phone}</Text>
      <Text>DOB: {data.dob}</Text>
      <Text>Household: {data.householdSize}</Text>
      <Text>Address: {data.address1}, {data.city}, {data.province} {data.postalCode}</Text>
      {!!data.govIdUri && <Image source={{ uri: data.govIdUri }} style={styles.preview} />}
      {!!data.selfieUri && <Image source={{ uri: data.selfieUri }} style={styles.preview} />}
      <PrimaryButton title={loading ? 'Submitting...' : 'Submit Registration'} onPress={onSubmit} disabled={loading} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 20 },
  preview: { width: '100%', height: 160, borderRadius: 8, marginTop: 8 }
});
EOF
