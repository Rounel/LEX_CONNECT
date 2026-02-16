import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '@/constants/storage-keys';

type AppState = {
  isReady: boolean;
  hasCompletedOnboarding: boolean;
  selectedCountry: string | null;
};

type AppStateAction =
  | { type: 'LOADED'; hasCompletedOnboarding: boolean; selectedCountry: string | null }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SET_COUNTRY'; country: string };

type AppStateContextValue = AppState & {
  completeOnboarding: () => Promise<void>;
  setCountry: (code: string) => Promise<void>;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function appStateReducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case 'LOADED':
      return {
        ...state,
        isReady: true,
        hasCompletedOnboarding: action.hasCompletedOnboarding,
        selectedCountry: action.selectedCountry,
      };
    case 'COMPLETE_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true };
    case 'SET_COUNTRY':
      return { ...state, selectedCountry: action.country };
  }
}

const initialState: AppState = {
  isReady: false,
  hasCompletedOnboarding: false,
  selectedCountry: null,
};

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  useEffect(() => {
    AsyncStorage.multiGet([
      StorageKeys.HAS_COMPLETED_ONBOARDING,
      StorageKeys.SELECTED_COUNTRY,
    ]).then(([onboarding, country]) => {
      dispatch({
        type: 'LOADED',
        hasCompletedOnboarding: onboarding[1] === 'true',
        selectedCountry: country[1],
      });
    });
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(StorageKeys.HAS_COMPLETED_ONBOARDING, 'true');
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const setCountry = async (code: string) => {
    await AsyncStorage.setItem(StorageKeys.SELECTED_COUNTRY, code);
    dispatch({ type: 'SET_COUNTRY', country: code });
  };

  return (
    <AppStateContext value={{ ...state, completeOnboarding, setCountry }}>
      {children}
    </AppStateContext>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
