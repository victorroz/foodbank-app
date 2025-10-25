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
