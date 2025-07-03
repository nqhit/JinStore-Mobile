// useHideTabBar.ts
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

export const useHideTabBar = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();

    if (parent) {
      parent.setOptions({
        tabBarStyle: {
          display: 'none',
          position: 'absolute',
          bottom: -100,
          opacity: 0,
          transition: 'all 0.1s ease-in-out',
        },
      });

      return () => {
        parent.setOptions({
          tabBarStyle: {
            display: 'flex',
            position: 'relative',
            bottom: 0,
            opacity: 1,
            transition: 'all 0.4s ease-in-out',
          },
        });
      };
    }
  }, [navigation]);
};
