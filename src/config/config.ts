export const config = () => ({
  redis: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  efi: {
    clientId: process.env.EFI_CLIENT_ID,
    secret: process.env.EFI_SECRET,
  },
});
