import AddressCard from '@/components/address/AddressCard';
import Loading from '@/components/loading';
import FText from '@/components/Text';
import { useTabBarVisibility } from '@/context/TabBarVisibilityContext';
import { useSingledPush } from '@/hooks/useSignlePush';
import { AddressType } from '@/interfaces/address.type';
import { useAddress } from '@/server/hooks/useAddress';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Address() {
  const navigation = useNavigation();
  const singlePush = useSingledPush();
  const { getCustomerAddress, deleteAddress } = useAddress();
  const { setVisible } = useTabBarVisibility();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AddressType[]>([]);

  const handleGetAllAddress = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCustomerAddress();
      if (res.success) {
        const sortedData = [...res.data].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
        setData(sortedData);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteAddress = useCallback(async (id: string) => {
    const res = await deleteAddress(id);
    if (res.success) {
      setData((prev) => prev.filter((item) => item._id !== id));
    }
  }, []);

  const handleEdit = useCallback(
    (address: AddressType) => {
      singlePush(`/actionsAddress/[id]`, {
        ...address,
        action: 'edit',
      });
    },
    [singlePush],
  );

  const handleAddNew = useCallback(() => {
    singlePush('/actionsAddress/[id]', { action: 'add' });
  }, [singlePush]);

  const keyExtractorAddress = (item: AddressType, index: number) => {
    const id = item._id?.toString() || `temp-${index}`;
    return `${id}-${index}`;
  };

  const renderItem = ({ item }: { item: AddressType }) => (
    <AddressCard value={item} onDelete={() => handleDeleteAddress(item._id || '')} onEdit={() => handleEdit(item)} />
  );

  useEffect(() => {
    handleGetAllAddress();
  }, [handleGetAllAddress]);

  useEffect(() => {
    setVisible(false);

    return () => setVisible(true);
  }, [setVisible]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAddNew}>
          <Ionicons name="add" size={26} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [handleAddNew, navigation]);
  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 15, backgroundColor: 'white' }}
      edges={['bottom', 'left', 'right']}
    >
      {loading ? (
        <Loading />
      ) : data.length === 0 ? (
        <FText>Không có địa chỉ nào</FText>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractorAddress}
          style={{ flex: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingVertical: 15 }}
        />
      )}
    </SafeAreaView>
  );
}

export default Address;
