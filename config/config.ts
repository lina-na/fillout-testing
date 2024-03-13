import { config } from 'dotenv';
config({ path: '.env' });

export const serverConfig = {
  port: parseInt(process.env.PORT, 10) || 3000,
  api_key: process.env.API_KEY,
  form_id: process.env.FORM_ID,
  request_url: `${process.env.FILLOUT_URL}/v1/api/forms/${process.env.FORM_ID}`,
};
