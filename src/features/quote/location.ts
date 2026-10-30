import { z } from 'zod';
import { stateCodes } from '../../config/states';

const locationSchema = z.object({
  countryCode: z.literal('BR'),
  principalSubdivisionCode: z.string(),
  city: z.string().trim().min(2).max(80),
});

export type DetectedLocation = { state: (typeof stateCodes)[number]; city: string };

export function parseLocation(payload: unknown): DetectedLocation {
  const data = locationSchema.parse(payload);
  const state = z.enum(stateCodes).parse(data.principalSubdivisionCode.replace(/^BR-/, ''));
  return { state, city: data.city };
}

/** Only called after the visitor explicitly chooses to locate their device. */
export async function detectLocation(signal: AbortSignal): Promise<DetectedLocation> {
  if (!navigator.geolocation) {
    throw new Error('Seu navegador não oferece localização. Preencha estado e cidade.');
  }
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    });
  }).catch((error: GeolocationPositionError) => {
    throw new Error(
      error.code === 1
        ? 'Localização não autorizada. Você pode preencher estado e cidade manualmente.'
        : 'Não foi possível localizar seu dispositivo. Preencha estado e cidade.',
    );
  });
  signal.throwIfAborted();
  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
  url.searchParams.set('latitude', String(position.coords.latitude));
  url.searchParams.set('longitude', String(position.coords.longitude));
  url.searchParams.set('localityLanguage', 'pt');
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]),
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
  });
  if (!response.ok)
    throw new Error('O serviço de localização está indisponível. Preencha os campos.');
  try {
    return parseLocation(await response.json());
  } catch {
    throw new Error('Não identificamos uma cidade e UF no Brasil. Preencha os campos manualmente.');
  }
}
