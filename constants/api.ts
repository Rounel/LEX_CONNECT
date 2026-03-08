// URL de base de l'API Wilex (FastAPI)
// Dev : API locale | Prod : à remplacer par l'URL déployée
//
// ⚠️  Sur Android, `localhost` ne pointe PAS vers ta machine host.
//   - Android Emulator  → http://10.0.2.2:8000
//   - Appareil physique → http://<IP_DE_TA_MACHINE>:8000  (ex: http://192.168.1.42:8000)
//   - iOS Simulator     → http://localhost:8000 fonctionne

import { Platform } from 'react-native';

const DEV_HOST = Platform.OS === 'android'
  ? '10.0.2.2'   // Android Emulator → pointe vers le host machine
  : 'localhost';  // iOS Simulator / Web

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:8000`
  : 'https://api.wilex.ci';
