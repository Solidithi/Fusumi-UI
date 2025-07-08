export interface SubscriptionFormConfig {
  email: boolean;
  fullName: boolean;
  phone: boolean;
  address: boolean;
  zipcode: boolean;
  nationality: boolean;
  personalId: boolean;
  sex: boolean;
  birthdate: boolean;
  image: boolean;
  taxId: boolean;
  kycImage: boolean;
}

export interface SubscriptionFormData {
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  zipcode?: string;
  nationality?: string;
  personalId?: string;
  sex?: "male" | "female" | "other";
  birthdate?: string;
  image?: File;
  taxId?: string;
  kycImage?: File;
}

export interface ServiceSubscriptionData {
  serviceId: string;
  serviceName: string;
  businessName: string;
  price: number;
  formConfig: SubscriptionFormConfig;
}
