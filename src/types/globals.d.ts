declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'set' | 'event' | 'consent',
      targetId: string | object,
      config?: object
    ) => void;
  }

  function gtag(
    command: 'config' | 'set' | 'event' | 'consent',
    targetId: string | object,
    config?: object
  ): void;
}

export {};