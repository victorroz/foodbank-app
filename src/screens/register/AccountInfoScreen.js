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
            <PrimaryButton title="Continue" onPress={handleSubmit} disabled={Boolean(!isValid)} />
          </>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({ wrap: { flex: 1, padding: 20 } });
