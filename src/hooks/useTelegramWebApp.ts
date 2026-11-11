import { useEffect, useState, useCallback, useRef } from 'react';
import type { TelegramWebApp, TelegramUser } from '../types/telegram';

export interface TelegramState {
  isTelegram: boolean;
  user: TelegramUser | null;
  colorScheme: 'dark' | 'light';
  platform: string;
}

export function useTelegramWebApp() {
  const [tgState, setTgState] = useState<TelegramState>(() => {
    const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
    const isTg = Boolean(
      tg &&
        (Boolean(tg.initData) ||
          Boolean(tg.initDataUnsafe?.user) ||
          (Boolean(tg.platform) && tg.platform !== 'unknown') ||
          window.location.hash.includes('tgWebAppData'))
    );

    return {
      isTelegram: isTg,
      user: tg?.initDataUnsafe?.user || null,
      colorScheme: tg?.colorScheme || 'dark',
      platform: tg?.platform || 'web',
    };
  });

  const mainButtonCallbackRef = useRef<(() => void) | null>(null);
  const backButtonCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const tg: TelegramWebApp | undefined = window.Telegram?.WebApp;
    if (!tg) return;

    try {
      // 1. Notify Telegram the WebApp is ready and expand to full view
      tg.ready();
      tg.expand();

      // 2. Set theme colors for native header and background
      if (tg.setHeaderColor) {
        tg.setHeaderColor(tg.colorScheme === 'light' ? '#ffffff' : '#090d16');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor(tg.colorScheme === 'light' ? '#ffffff' : '#090d16');
      }

      // 3. Enable swipe-to-close confirmation so users don't lose typed marks accidentally
      if (tg.enableClosingConfirmation) {
        tg.enableClosingConfirmation();
      }

      // 4. Listen to theme changes in Telegram client
      const handleThemeChange = () => {
        setTgState((prev) => ({
          ...prev,
          colorScheme: tg.colorScheme || 'dark',
        }));
        if (tg.setHeaderColor) {
          tg.setHeaderColor(tg.colorScheme === 'light' ? '#ffffff' : '#090d16');
        }
        if (tg.setBackgroundColor) {
          tg.setBackgroundColor(tg.colorScheme === 'light' ? '#ffffff' : '#090d16');
        }
      };

      tg.onEvent('themeChanged', handleThemeChange);

      return () => {
        tg.offEvent('themeChanged', handleThemeChange);
      };
    } catch (err) {
      console.warn('Telegram WebApp initialization error:', err);
    }
  }, []);

  // Haptic feedback utility
  const haptic = useCallback(
    (
      type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection' = 'light'
    ) => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.HapticFeedback) return;

      try {
        if (type === 'selection') {
          tg.HapticFeedback.selectionChanged();
        } else if (type === 'success' || type === 'warning' || type === 'error') {
          tg.HapticFeedback.notificationOccurred(type);
        } else {
          tg.HapticFeedback.impactOccurred(type);
        }
      } catch {
        // Haptics fail silently if unsupported on device
      }
    },
    []
  );

  // Configure Telegram MainButton safely
  const configureMainButton = useCallback(
    (options: {
      text: string;
      isVisible: boolean;
      onClick?: () => void;
      color?: string;
      textColor?: string;
    }) => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.MainButton) return;

      const { text, isVisible, onClick, color, textColor } = options;

      // Remove existing handler
      if (mainButtonCallbackRef.current) {
        tg.MainButton.offClick(mainButtonCallbackRef.current);
        mainButtonCallbackRef.current = null;
      }

      if (isVisible) {
        tg.MainButton.setText(text);
        if (color) tg.MainButton.color = color;
        if (textColor) tg.MainButton.textColor = textColor;

        if (onClick) {
          mainButtonCallbackRef.current = onClick;
          tg.MainButton.onClick(onClick);
        }
        tg.MainButton.show();
      } else {
        tg.MainButton.hide();
      }
    },
    []
  );

  // Configure Telegram BackButton safely
  const configureBackButton = useCallback(
    (options: { isVisible: boolean; onClick?: () => void }) => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.BackButton) return;

      const { isVisible, onClick } = options;

      if (backButtonCallbackRef.current) {
        tg.BackButton.offClick(backButtonCallbackRef.current);
        backButtonCallbackRef.current = null;
      }

      if (isVisible) {
        if (onClick) {
          backButtonCallbackRef.current = onClick;
          tg.BackButton.onClick(onClick);
        }
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }
    },
    []
  );

  return {
    ...tgState,
    haptic,
    configureMainButton,
    configureBackButton,
  };
}
