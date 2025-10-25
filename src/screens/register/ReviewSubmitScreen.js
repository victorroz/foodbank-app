import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
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
      Alert.alert('Submit failed. Try again.');
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
      <PrimaryButton title={loading ? 'Submitting...' : 'Submit Registration'} onPress={onSubmit} disabled={Boolean(loading)} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 20 },
  preview: { width: '100%', height: 160, borderRadius: 8, marginTop: 8 }
});
