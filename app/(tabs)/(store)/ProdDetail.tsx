import FText from '@/components/Text';
import { useTabBarVisibility } from '@/Context/TabBarVisibilityContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function ProductDetail() {
  const { setVisible } = useTabBarVisibility();
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  const screenStart = params.screenStart as string;
  const id = params.id as string;

  const handleBack = useCallback(() => {
    if (screenStart === 'home') {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/(tabs)/(store)');
    }
  }, [screenStart]);

  useEffect(() => {
    setVisible(false);

    return () => setVisible(true);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, screenStart, handleBack]);

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']}>
      <View>
        <FText>Product Detail of {id}</FText>
      </View>
    </SafeAreaView>
  );
}

export default ProductDetail;
