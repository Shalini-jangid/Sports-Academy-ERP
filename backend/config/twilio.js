import dotenv from 'dotenv';
dotenv.config(); // load .env

import Twilio from 'twilio';

console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID); // debug

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`SMS sent to ${to}`);
  } catch (err) {
    console.error('SMS sending failed:', err);
  }
};
