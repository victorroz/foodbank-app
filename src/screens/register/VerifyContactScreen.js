import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await verifyOtp({ userId: data.userId, code: values.otp || '123456' });
            navigation.navigate('GovId');
          } catch (e) {
            Alert.alert('Verification failed', 'Please check the code and try again.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, isSubmitting }) => (
          <>
            <FormTextInput label="Enter Code" keyboardType="number-pad" maxLength={6}
              value={values.otp} onChangeText={handleChange('otp')} onBlur={handleBlur('otp')}
              error={touched.otp && errors.otp} />
            <PrimaryButton title={isSubmitting ? 'Verifying...' : 'Verify & Continue'} onPress={handleSubmit} disabled={Boolean(!isValid || isSubmitting)} />
          </>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 }, p: { marginBottom: 12 } });
