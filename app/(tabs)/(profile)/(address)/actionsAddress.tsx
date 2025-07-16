import { FormAddress } from '@/components/Form/FormAddress';
import { useKeyboardPadding } from '@/hooks/useKeyboardPadding';
import { AddressFormValues } from '@/interfaces/address.type';
import { useAddress } from '@/server/hooks/useAddress';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

function AddAddress() {
  const keyboardPadding = useKeyboardPadding(20);
  const { addAddressCustomer } = useAddress();

  const [isLoading, setIsLoading] = useState(false);

  const handleAddAddress = useCallback(
    async (address: AddressFormValues) => {
      try {
        setIsLoading(true);
        const res = await addAddressCustomer(address);
        if (res.success) {
          Toast.show({
            type: 'success',
            text1: res.message,
            text1Style: { color: 'green', fontSize: 18, fontWeight: '600', backgroundColor: 'red' },
            position: 'top',
            visibilityTime: 1000,
          });
          router.back();
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: (error as Error).message,
          text1Style: { color: 'green', fontSize: 18, fontWeight: '600', backgroundColor: 'red' },
          position: 'top',
          visibilityTime: 1000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addAddressCustomer],
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FormAddress onSubmit={(values) => handleAddAddress(values)} isLoading={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AddAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
});
