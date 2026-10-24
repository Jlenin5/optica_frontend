export type CustomerType = 'PERSONA' | 'EMPRESA';
export type DocumentType = 'DNI' | 'CE' | 'RUC' | 'PASAPORTE';
export type CustomerStatus = 'ACTIVO' | 'INACTIVO';

export interface CustomerDraft {
  customer_type: CustomerType;
  full_name: string;
  document_type: DocumentType;
  document_number: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  status: CustomerStatus;
}

export interface Customer extends CustomerDraft {
  id: string;
  created_at?: string;
}
