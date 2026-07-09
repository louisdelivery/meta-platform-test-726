export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  meta: {
    graphApiVersion: process.env.META_GRAPH_API_VERSION ?? 'v23.0',
    accessToken: process.env.META_ACCESS_TOKEN ?? '',
    phoneNumberId: process.env.META_PHONE_NUMBER_ID ?? '',
    wabaId: process.env.META_WABA_ID ?? '',
    appSecret: process.env.META_APP_SECRET ?? '',
    verifyToken: process.env.META_VERIFY_TOKEN ?? 'local_verify_token',
  },
  lab: {
    downloadDir: process.env.DOWNLOAD_DIR ?? 'uploads',
    simulatorPhoneNumber: process.env.SIMULATOR_PHONE_NUMBER ?? '33600000000',
  },
});
