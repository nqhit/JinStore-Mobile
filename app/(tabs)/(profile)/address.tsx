import AddressCard from '@/components/address/AddressCard';
import { AddressType } from '@/interfaces/address.type';
import { useAddress } from '@/server/hooks/useAddress';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Address() {
  const navigation = useNavigation();
  const { getAllAddress } = useAddress();
  const [data, setData] = useState<AddressType[]>([]);

  const handleGetAllAddress = useCallback(async () => {
    await getAllAddress().then((res) => setData(res.data));
  }, [getAllAddress]);

  const keyExtractorAddress = (item: AddressType, index: number) => {
    // Đảm bảo key luôn unique bằng cách kết hợp _id và index
    const id = item._id?.toString() || `temp-${index}`;
    return `${id}-${index}`;
  };

  const renderItem = ({ item }: { item: AddressType }) => <AddressCard value={item} />;

  useEffect(() => {
    handleGetAllAddress();
  }, [handleGetAllAddress]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="add" size={26} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 15, backgroundColor: 'white' }}
      edges={['bottom', 'left', 'right']}
    >
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractorAddress}
        style={{ flex: 1 }}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        contentContainerStyle={{ paddingVertical: 15 }}
      />
    </SafeAreaView>
  );
}

export default Address;
