import axios from 'axios';
import Constants from 'expo-constants';

const baseURL = Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:4000';
const MOCK = Boolean(
  Constants.expoConfig?.extra?.MOCK_MODE === true ||
  Constants.expoConfig?.extra?.MOCK_MODE === 'true'
);

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
