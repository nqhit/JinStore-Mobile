export interface AddressType extends AddressFormValues {
  _id: string;
  _idUser: string;
}

export interface AddressFormValues {
  detailed: string;
  district: string;
  city: string;
  province: string;
  isDefault: boolean;
}
