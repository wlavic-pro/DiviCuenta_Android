import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.divicuenta.app',
  appName: 'DiviCuenta',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
