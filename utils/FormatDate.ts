import moment from 'moment';

export const formatDateForDisplay = (isoDate: string): string => {
  if (!isoDate) return '';
  const momentDate = moment(isoDate);
  return momentDate.isValid() ? momentDate.format('DD/MM/YYYY') : '';
};
