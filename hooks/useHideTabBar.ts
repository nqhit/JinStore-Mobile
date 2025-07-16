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
        },
      });
    }

    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            display: 'flex',
          },
        });
      }
    };
  }, [navigation]);
};
