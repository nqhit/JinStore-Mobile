// hooks/useKeyboardPadding.ts
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardPadding = (extra: number = 20) => {
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardPadding(e.endCoordinates.height + extra);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardPadding(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [extra]);

  return keyboardPadding;
};
