import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DonorScreen from '../screens/DonorScreen';

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
      <Root.Screen name="Donor" component={DonorScreen} options={{ title: 'Donate' }} />
      <Root.Screen name="RegisterFlow" component={RegisterNavigator} options={{ headerShown: false }} />
      <Root.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
    </Root.Navigator>
  );
}
