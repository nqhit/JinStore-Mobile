import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTabBarVisibility } from '../../context/TabBarVisibilityContext';

export const AnimatedTabBar: React.FC<BottomTabBarProps> = (props) => {
  const { visible } = useTabBarVisibility();
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 100, // Ẩn xuống dưới
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <BottomTabBar {...props} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
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
  },
});
