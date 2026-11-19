import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FACILITIES_CACHE: 'valid_facilities_cache',
  PROFESSIONALS_CACHE: 'valid_professionals_cache',
  LLM_API_KEY: 'valid_llm_api_key',
  LLM_BASE_URL: 'valid_llm_base_url',
  LLM_MODEL: 'valid_llm_model',
  LAST_LOCATION: 'valid_last_location',
} as const;

export async function cacheFacilities(data: any[]) {
  await AsyncStorage.setItem(KEYS.FACILITIES_CACHE, JSON.stringify({
    data,
    cachedAt: Date.now(),
  }));
}

export async function getCachedFacilities(): Promise<{ data: any[]; cachedAt: number } | null> {
  const raw = await AsyncStorage.getItem(KEYS.FACILITIES_CACHE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function cacheProfessionals(data: any[]) {
  await AsyncStorage.setItem(KEYS.PROFESSIONALS_CACHE, JSON.stringify({
    data,
    cachedAt: Date.now(),
  }));
}

export async function getCachedProfessionals(): Promise<{ data: any[]; cachedAt: number } | null> {
  const raw = await AsyncStorage.getItem(KEYS.PROFESSIONALS_CACHE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveLlmSettings(settings: {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}) {
  await AsyncStorage.setItem(KEYS.LLM_API_KEY, settings.apiKey);
  if (settings.baseUrl) await AsyncStorage.setItem(KEYS.LLM_BASE_URL, settings.baseUrl);
  if (settings.model) await AsyncStorage.setItem(KEYS.LLM_MODEL, settings.model);
}

export async function getLlmSettings(): Promise<{
  apiKey: string | null;
  baseUrl: string;
  model: string;
}> {
  const [apiKey, baseUrl, model] = await Promise.all([
    AsyncStorage.getItem(KEYS.LLM_API_KEY),
    AsyncStorage.getItem(KEYS.LLM_BASE_URL),
    AsyncStorage.getItem(KEYS.LLM_MODEL),
  ]);
  return {
    apiKey,
    baseUrl: baseUrl || 'https://api.openai.com/v1',
    model: model || 'gpt-4o-mini',
  };
}

export async function saveLastLocation(lat: number, lon: number) {
  await AsyncStorage.setItem(KEYS.LAST_LOCATION, JSON.stringify({ lat, lon, at: Date.now() }));
}

export async function getLastLocation(): Promise<{ lat: number; lon: number; at: number } | null> {
  const raw = await AsyncStorage.getItem(KEYS.LAST_LOCATION);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
