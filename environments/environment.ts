import { devEnvironment } from './environment.dev';
import { prodEnvironment } from './environment.prod';

// Determine the active environment profile.
// Default to 'prod' if NODE_ENV is production (e.g., on Vercel), otherwise 'dev'.
const appEnv = process.env.NEXT_PUBLIC_APP_ENV || (process.env.NODE_ENV === 'production' ? 'prod' : 'dev');

export const environment = (appEnv === 'prod' || appEnv === 'production') 
  ? prodEnvironment 
  : devEnvironment;
