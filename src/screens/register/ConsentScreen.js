import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import StepProgressBar from '../../components/StepProgressBar';
import useRegistrationStore from '../../store/registrationStore';
import { fonts } from '../../theme';

const toBool = (v) => v === true || v === 'true' || v === 1 || v === '1';

export default function ConsentScreen({ navigation }) {
  const { data, setField } = useRegistrationStore();
  const [consentData, setConsentData] = useState(toBool(data.consentData));
  const [consentMarketing, setConsentMarketing] = useState(toBool(data.consentMarketing));



  const onNext = () => {
    const requiredConsent = Boolean(consentData);
    setField('consentData', requiredConsent);
    setField('consentMarketing', Boolean(consentMarketing));
    if (!requiredConsent) {
      Alert.alert('Please accept the Data Consent to continue.');
      return;
    }
    navigation.navigate('ReviewSubmit');
  };

  return (
    <View style={styles.wrap}>
      <StepProgressBar step={6} />
      <Text style={[fonts.h2, { marginBottom: 12 }]}>Consents</Text>
      <View style={styles.row}>
        <Text style={styles.label}>I agree to data processing for eligibility & verification</Text>
        <Switch value={Boolean(consentData)} onValueChange={(v) => setConsentData(Boolean(v))} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>I agree to receive program updates (optional)</Text>
        <Switch value={Boolean(consentMarketing)} onValueChange={(v) => setConsentMarketing(Boolean(v))} />
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
