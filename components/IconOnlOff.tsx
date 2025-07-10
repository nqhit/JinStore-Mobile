import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface IconOnlOffProps {
  size?: number;
  showText?: boolean;
  textStyle?: any;
}

const IconOnlOff: React.FC<IconOnlOffProps> = ({ size = 20, showText = false, textStyle }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Kiểm tra trạng thái mạng ban đầu
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online ?? false);

      // Hiệu ứng khi thay đổi trạng thái
      if (online) {
        // Hiệu ứng khi online
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        // Hiệu ứng pulse cho online
        Animated.loop(
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ).start();
      } else {
        // Hiệu ứng khi offline
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        // Dừng pulse animation
        pulseAnim.setValue(1);
      }
    });

    return () => unsubscribe();
  }, []);

  const getIconName = () => {
    return isOnline ? 'wifi' : 'wifi-outline';
  };

  const getIconColor = () => {
    return isOnline ? '#4CAF50' : '#F44336';
  };

  const getBackgroundColor = () => {
    return isOnline ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';
  };

  const getText = () => {
    return isOnline ? 'Online' : 'Offline';
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            backgroundColor: getBackgroundColor(),
            opacity: fadeAnim,
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
          },
        ]}
      >
        <Ionicons name={getIconName()} size={size} color={getIconColor()} />
      </Animated.View>

      {showText && (
        <Animated.Text style={[styles.statusText, { color: getIconColor(), opacity: fadeAnim }, textStyle]}>
          {getText()}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default IconOnlOff;
