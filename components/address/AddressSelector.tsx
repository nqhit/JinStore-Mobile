import { COLORS } from '@/constants/Colors';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FText from '../Text';

interface AddressSelectorProps {
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
  onProvinceChange,
  onCityChange,
  onDistrictChange,
  errors,
  touched,
}) => {
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]); // Thành phố/Quận
  const [districts, setDistricts] = useState<Option[]>([]); // Phường/Xã

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Fetch province
  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/p/').then((res) => {
      const items = res.data.map((item: any) => ({
        label: item.name,
        value: item.code,
      }));
      setProvinces(items);
    });
  }, []);

  // Fetch city (districts in API)
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      return;
    }
    axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`).then((res) => {
      const items = res.data.districts.map((item: any) => ({
        label: item.name,
        value: item.code,
      }));
      setCities(items);
    });
  }, [selectedProvince]);

  // Fetch district (wards in API)
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      return;
    }
    axios.get(`https://provinces.open-api.vn/api/d/${selectedCity}?depth=2`).then((res) => {
      const items = res.data.wards.map((item: any) => ({
        label: item.name,
        value: item.code,
      }));
      setDistricts(items);
    });
  }, [selectedCity]);

  return (
    <View style={styles.pickerContainer}>
      <View
        style={[
          styles.pickerContent,
          errors.province && touched.province ? { marginBottom: 0 } : { marginBottom: 23.3 },
        ]}
      >
        <View
          style={{ ...styles.picker, borderColor: errors.province && touched.province ? COLORS.error : COLORS.gray200 }}
        >
          <RNPickerSelect
            onValueChange={(value) => {
              const selected = provinces.find((item: any) => item.value === value) as any;
              onProvinceChange(selected?.label || '');
              setSelectedProvince(selected?.value || '');
              onCityChange('');
              onDistrictChange('');
              setSelectedCity('');
              setSelectedDistrict('');
            }}
            items={provinces}
            placeholder={{ label: 'Chọn tỉnh', value: '' }}
            value={selectedProvince}
            style={{
              placeholder: {
                color: COLORS.gray500,
                fontSize: 18,
              },
            }}
          />
        </View>
        {errors.province && touched.province && <FText style={styles.errorText}>{errors.province}</FText>}
      </View>

      <View style={[styles.pickerContent, errors.city && touched.city ? { marginBottom: 0 } : { marginBottom: 23.3 }]}>
        <View style={{ ...styles.picker, borderColor: errors.city && touched.city ? COLORS.error : COLORS.gray200 }}>
          <RNPickerSelect
            onValueChange={(value) => {
              const selected = cities.find((item: any) => item.value === value) as any;
              onCityChange(selected?.label || '');
              setSelectedCity(selected?.value || '');
              onDistrictChange('');
              setSelectedDistrict('');
            }}
            items={cities}
            placeholder={{ label: 'Chọn thành phố/quận', value: '' }}
            disabled={!selectedProvince}
            value={selectedCity}
            style={{
              placeholder: {
                color: COLORS.gray500,
                fontSize: 18,
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
            onValueChange={(value) => {
              const selected = districts.find((item: any) => item.value === value) as any;
              onDistrictChange(selected?.label || '');
              setSelectedDistrict(selected?.value || '');
            }}
            items={districts}
            placeholder={{ label: 'Chọn phường/xã', value: '' }}
            disabled={!selectedCity}
            value={selectedDistrict}
            style={{
              placeholder: {
                color: COLORS.gray500,
                fontSize: 18,
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
