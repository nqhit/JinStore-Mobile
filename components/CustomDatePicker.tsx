// File: components/CustomDatePicker.tsx

import { COLORS } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomDatePickerProps {
  isVisible: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ isVisible, date, onConfirm, onCancel }) => {
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(date.getDate());

  const yearRef = useRef<FlatList>(null);
  const monthRef = useRef<FlatList>(null);
  const dayRef = useRef<FlatList>(null);

  const years = useMemo(() => Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i), []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const daysInMonth = useMemo(() => new Date(selectedYear, selectedMonth, 0).getDate(), [selectedYear, selectedMonth]);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  useEffect(() => {
    if (isVisible) {
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth() + 1);
      setSelectedDay(date.getDate());

      setTimeout(() => {
        yearRef.current?.scrollToOffset({
          offset: years.findIndex((y) => y === date.getFullYear()) * ITEM_HEIGHT,
          animated: false,
        });
        monthRef.current?.scrollToOffset({
          offset: date.getMonth() * ITEM_HEIGHT,
          animated: false,
        });
        dayRef.current?.scrollToOffset({
          offset: (date.getDate() - 1) * ITEM_HEIGHT,
          animated: false,
        });
      }, 50);
    }
  }, [isVisible]);

  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedMonth, selectedYear, daysInMonth]);

  const handleScrollEnd = (data: number[], setter: (value: number) => void) => (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    setter(data[index]);
  };

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    onConfirm(newDate);
  };

  if (!isVisible) return null;

  const renderPicker = (
    data: number[],
    selected: number,
    setter: (value: number) => void,
    label: string,
    ref: React.RefObject<FlatList<any> | null>,
  ) => {
    const index = data.findIndex((item) => item === selected);
    return (
      <View style={styles.pickerColumn}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerWrapper}>
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'transparent', 'transparent', 'rgba(255,255,255,0.9)']}
            style={styles.gradientOverlay}
            pointerEvents="none"
          />
          <FlatList
            ref={ref}
            data={data}
            keyExtractor={(item) => item.toString()}
            style={styles.picker}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            snapToAlignment="center"
            scrollEnabled
            onMomentumScrollEnd={handleScrollEnd(data, setter)}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            initialScrollIndex={index}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                ref.current?.scrollToIndex({ index: info.index, animated: false });
              }, 100);
            }}
            contentContainerStyle={{
              paddingVertical: ITEM_HEIGHT,
            }}
            renderItem={({ item }) => (
              <View style={[styles.option, selected === item && styles.selectedOption]}>
                <Text style={[styles.optionText, selected === item && styles.selectedText]}>
                  {item.toString().padStart(2, '0')}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Chọn ngày sinh</Text>
          </View>

          <View style={styles.dateContainer}>
            {renderPicker(days, selectedDay, setSelectedDay, 'Ngày', dayRef)}
            {renderPicker(months, selectedMonth, setSelectedMonth, 'Tháng', monthRef)}
            {renderPicker(years, selectedYear, setSelectedYear, 'Năm', yearRef)}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={[styles.buttonText, styles.confirmText]}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
  },
  pickerWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    zIndex: 1,
  },
  picker: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: '100%',
  },
  option: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.black,
    fontSize: 16,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.gray200,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
  confirmText: {
    color: 'white',
  },
});
