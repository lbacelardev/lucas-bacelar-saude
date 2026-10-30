import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectLocation, parseLocation } from './location';

afterEach(() => vi.unstubAllGlobals());

describe('localização brasileira', () => {
  it.each([
    ['Fortaleza', 'CE'],
    ['São Paulo', 'SP'],
    ['Manaus', 'AM'],
    ['Brasília', 'DF'],
  ])('identifica %s / %s', (city, state) => {
    expect(
      parseLocation({ countryCode: 'BR', principalSubdivisionCode: `BR-${state}`, city }),
    ).toEqual({ city, state });
  });
  it.each([
    { countryCode: 'US', principalSubdivisionCode: 'US-CA', city: 'Los Angeles' },
    { countryCode: 'BR', principalSubdivisionCode: 'BR-XX', city: 'Cidade' },
    { countryCode: 'BR', principalSubdivisionCode: 'BR-SP', city: '' },
  ])('não inventa localização para resposta inválida', (data) => {
    expect(() => parseLocation(data)).toThrow();
  });
  it('não chama o geocodificador quando a permissão é negada', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const getCurrentPosition = vi.fn((_success, error) => error({ code: 1 }));
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } });
    await expect(detectLocation(new AbortController().signal)).rejects.toThrow('não autorizada');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
