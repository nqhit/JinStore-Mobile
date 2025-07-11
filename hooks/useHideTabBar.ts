import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useHideTabBar = () => {
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useLayoutEffect(() => {
    // Khi vào màn hình: animate ẩn tab bar
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          elevation: 8,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          transform: [{ translateY }],
          opacity: opacity,
        },
      });
    }

    // Khi rời màn hình: animate hiện lại tab bar
    return () => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: {
              position: 'relative',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              elevation: 8,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              transform: [{ translateY: 0 }],
              opacity: 1,
            },
          });
        }
      });
    };
  }, [navigation, opacity, translateY]);
};
