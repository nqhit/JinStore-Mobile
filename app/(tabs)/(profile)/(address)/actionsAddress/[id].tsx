import { FormAddress } from '@/components/Form/FormAddress';
import { AddressFormValues } from '@/interfaces/address.type';
import { useAddress } from '@/server/hooks/useAddress';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

function AddAddress() {
  const { actionsAddressCustomer } = useAddress();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = params.action === 'edit';
  const addressData: AddressFormValues | undefined = isEditMode
    ? {
        detailed: params.detailed as string,
        province: params.province as string,
        city: params.city as string,
        district: params.district as string,
        isDefault: params.isDefault === 'true',
      }
    : undefined;

  const handleActionsAddress = useCallback(
    async (address: AddressFormValues, id?: string) => {
      let res = null;
      try {
        setIsLoading(true);
        if (id) {
          res = await actionsAddressCustomer(address, id);
        } else {
          res = await actionsAddressCustomer(address);
        }
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
    [actionsAddressCustomer],
  );

  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ',
    });
  }, [isEditMode, navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FormAddress
          valuesDefault={addressData as AddressFormValues}
          onSubmit={(values) => (id ? handleActionsAddress(values, id) : handleActionsAddress(values))}
          isLoading={isLoading}
        />
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
