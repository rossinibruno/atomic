export const config = () => ({
  basicAuth: {
    username: process.env.HTTP_BASIC_USER,
    password: process.env.HTTP_BASIC_PASS,
  },
  autentique: {
    token: process.env.AUTENTIQUE_TOKEN,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  efi: {
    clientId: process.env.EFI_CLIENT_ID,
    secret: process.env.EFI_SECRET,
  },
  supabase: {
    username: process.env.SUPABASE_USERNAME,
    password: process.env.SUPABASE_PASSWORD,
  },
});
