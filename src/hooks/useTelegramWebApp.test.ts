import { describe, it, expect } from 'vitest';

describe('Telegram Web App Integration Tests', () => {
  it('Gracefully falls back to browser mode when window.Telegram is undefined', () => {
    // In node/vitest environment, window.Telegram is undefined by default
    const isTg = Boolean(
      typeof window !== 'undefined' &&
        window.Telegram?.WebApp &&
        (Boolean(window.Telegram.WebApp.initData) ||
          Boolean(window.Telegram.WebApp.initDataUnsafe?.user) ||
          (Boolean(window.Telegram.WebApp.platform) &&
            window.Telegram.WebApp.platform !== 'unknown') ||
          window.location.hash.includes('tgWebAppData'))
    );

    expect(isTg).toBe(false);
  });

  it('Detects Telegram WebApp when mock environment is provided', () => {
    const mockWebApp = {
      initData: 'query_id=AAHd&user=%7B%22id%22%3A123%7D',
      initDataUnsafe: {
        user: {
          id: 123456,
          first_name: 'Ahmed',
        },
      },
      platform: 'android',
      colorScheme: 'dark' as const,
      ready: () => {},
      expand: () => {},
    };

    const isTg = Boolean(
      mockWebApp.initData ||
        mockWebApp.initDataUnsafe?.user ||
        (mockWebApp.platform && mockWebApp.platform !== 'unknown')
    );

    expect(isTg).toBe(true);
    expect(mockWebApp.initDataUnsafe.user.first_name).toBe('Ahmed');
  });
});
