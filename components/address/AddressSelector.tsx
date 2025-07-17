import { COLORS } from '@/constants/Colors';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FText from '../Text';

interface AddressSelectorProps {
  valuesDefault?: {
    province: string;
    city: string;
    district: string;
  };
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  errors: {
    province?: string;
    city?: string;
    district?: string;
  };
  touched: {
    province?: boolean;
    city?: boolean;
    district?: boolean;
  };
}

type Option = { label: string; value: string | number };

const AddressSelector: React.FC<AddressSelectorProps> = ({
  valuesDefault,
  onProvinceChange,
  onCityChange,
  onDistrictChange,
  errors,
  touched,
}) => {
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  const [isDefaultLoaded, setIsDefaultLoaded] = useState(false);
  const [initialDefaults] = useState(valuesDefault);

  // Hàm tìm option theo label (có thể ignore case, trim)
  const findOptionByLabel = useCallback((options: Option[], label?: string) => {
    if (!label) return undefined;
    return (
      options.find((item) => item.label === label) ||
      options.find((item) => item.label.trim().toLowerCase() === label.trim().toLowerCase())
    );
  }, []);

  // Fetch provinces
  const fetchProvinces = useCallback(async () => {
    try {
      const res = await axios.get('https://provinces.open-api.vn/api/p/');
      const items = res.data.map((item: any) => ({
        label: item.name,
        value: item.code,
      }));
      setProvinces(items);
      // Set default province nếu có
      if (initialDefaults?.province) {
        const found = findOptionByLabel(items, initialDefaults.province);
        if (found) setSelectedProvince(found.value.toString());
      }
    } catch {}
  }, [initialDefaults?.province, findOptionByLabel]);

  // Fetch districts theo province
  const fetchDistricts = useCallback(
    async (provinceCode: string) => {
      if (!provinceCode) {
        setDistricts([]);
        setSelectedDistrict('');
        setWards([]);
        setSelectedWard('');
        return;
      }
      try {
        const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const items = res.data.districts.map((item: any) => ({
          label: item.name,
          value: item.code,
        }));
        setDistricts(items);
        // Set default district nếu có
        if (initialDefaults?.city && !isDefaultLoaded) {
          const found = findOptionByLabel(items, initialDefaults.city);
          if (found) setSelectedDistrict(found.value.toString());
        }
      } catch {}
    },
    [initialDefaults?.city, isDefaultLoaded, findOptionByLabel],
  );

  // Fetch wards theo district
  const fetchWards = useCallback(
    async (districtCode: string) => {
      if (!districtCode) {
        setWards([]);
        setSelectedWard('');
        return;
      }
      try {
        const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const items = res.data.wards.map((item: any) => ({
          label: item.name,
          value: item.code,
        }));
        setWards(items);
        // Set default ward nếu có
        if (initialDefaults?.district && !isDefaultLoaded) {
          const found = findOptionByLabel(items, initialDefaults.district);
          if (found) {
            setSelectedWard(found.value.toString());
            setIsDefaultLoaded(true);
          } else {
            setIsDefaultLoaded(true);
          }
        }
      } catch {}
    },
    [initialDefaults?.district, isDefaultLoaded, findOptionByLabel],
  );

  // Reset isDefaultLoaded khi valuesDefault thay đổi
  useEffect(() => {
    setIsDefaultLoaded(false);
  }, [valuesDefault]);

  // Load provinces khi mount
  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // Load districts khi province thay đổi
  useEffect(() => {
    fetchDistricts(selectedProvince);
  }, [selectedProvince, fetchDistricts]);

  // Load wards khi district thay đổi
  useEffect(() => {
    fetchWards(selectedDistrict);
  }, [selectedDistrict, fetchWards]);

  // Xử lý khi user chọn province
  const handleProvinceChange = useCallback(
    (value: string) => {
      const selected = provinces.find((item) => item.value === value);
      onProvinceChange(selected?.label || '');
      setSelectedProvince(value);
      // Reset district và ward
      onCityChange('');
      onDistrictChange('');
      setSelectedDistrict('');
      setSelectedWard('');
      setIsDefaultLoaded(true);
    },
    [provinces, onProvinceChange, onCityChange, onDistrictChange],
  );

  // Xử lý khi user chọn district
  const handleDistrictChange = useCallback(
    (value: string) => {
      const selected = districts.find((item) => item.value === value);
      onCityChange(selected?.label || '');
      setSelectedDistrict(value);
      // Reset ward
      onDistrictChange('');
      setSelectedWard('');
      setIsDefaultLoaded(true);
    },
    [districts, onCityChange, onDistrictChange],
  );

  // Xử lý khi user chọn ward
  const handleWardChange = useCallback(
    (value: string) => {
      const selected = wards.find((item) => item.value === value);
      onDistrictChange(selected?.label || '');
      setSelectedWard(value);
      setIsDefaultLoaded(true);
    },
    [wards, onDistrictChange],
  );

  return (
    <View style={styles.pickerContainer}>
      <View
        style={[
          styles.pickerContent,
          errors.province && touched.province ? { marginBottom: 0 } : { marginBottom: 23.3 },
        ]}
      >
        <View
          style={{
            ...styles.picker,
            borderColor: errors.province && touched.province ? COLORS.error : COLORS.gray200,
          }}
        >
          <RNPickerSelect
            onValueChange={handleProvinceChange}
            items={provinces}
            placeholder={{ label: 'Chọn tỉnh/thành phố', value: '' }}
            value={selectedProvince}
            style={{
              placeholder: {
                color: COLORS.gray500,
                fontSize: 18,
              },
              inputIOS: {
                fontSize: 18,
                paddingHorizontal: 12,
                paddingVertical: 12,
                color: 'black',
              },
              inputAndroid: {
                fontSize: 18,
                paddingHorizontal: 12,
                paddingVertical: 12,
                color: 'black',
              },
            }}
          />
        </View>
        {errors.province && touched.province && <FText style={styles.errorText}>{errors.province}</FText>}
      </View>

      <View style={[styles.pickerContent, errors.city && touched.city ? { marginBottom: 0 } : { marginBottom: 23.3 }]}>
        <View style={{ ...styles.picker, borderColor: errors.city && touched.city ? COLORS.error : COLORS.gray200 }}>
          <RNPickerSelect
            onValueChange={handleDistrictChange}
            items={districts}
            placeholder={{ label: 'Chọn quận/huyện', value: '' }}
            disabled={!selectedProvince}
            value={selectedDistrict}
            style={{
              placeholder: {
                color: COLORS.gray500,
                fontSize: 18,
              },
              inputIOS: {
                fontSize: 18,
                paddingHorizontal: 12,
                paddingVertical: 12,
                color: selectedProvince ? 'black' : COLORS.gray500,
              },
              inputAndroid: {
                fontSize: 18,
                paddingHorizontal: 12,
                paddingVertical: 12,
                color: selectedProvince ? 'black' : COLORS.gray500,
              },
            }}
          />
        </View>
        {errors.city && touched.city && <FText style={styles.errorText}>{errors.city}</FText>}
      </View>

      <View
        style={[
          styles.pickerContent,
          errors.district && touched.district ? { marginBottom: 0 } : { marginBottom: 22.3 },
        ]}
      >
        <View
          style={{ ...styles.picker, borderColor: errors.district && touched.district ? COLORS.error : COLORS.gray200 }}
        >
          <RNPickerSelect
            onValueChange={handleWardChange}
            items={wards}
            placeholder={{ label: 'Chọn phường/xã', value: '' }}
            disabled={!selectedDistrict}
            value={selectedWard}
            style={{
              placeholder: {
                color: COLORS.gray500,
                fontSize: 18,
              },
              inputIOS: {
                fontSize: 18,
                paddingHorizontal: 12,
                paddingVertical: 12,
                color: selectedDistrict ? 'black' : COLORS.gray500,
              },
              inputAndroid: {
                fontSize: 18,
                paddingHorizontal: 12,
                paddingVertical: 12,
                color: selectedDistrict ? 'black' : COLORS.gray500,
              },
            }}
          />
        </View>
        {errors.district && touched.district && <FText style={styles.errorText}>{errors.district}</FText>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    width: '100%',
  },
  pickerContent: {},

  picker: {
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    shadowColor: COLORS.gray200,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'left',
    fontSize: 13,
    paddingBottom: 5,
  },
});

export default AddressSelector;
