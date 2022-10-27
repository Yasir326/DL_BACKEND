export type ProfileType = {
  id: number;
  balance: number;
  type: 'contractor' | 'client';
};

export type ContractType = {
  id: number;
  ClientId: string;
  ContractorId: string;
  terms: string;
  status: 'new' | 'in_progress' | 'terminated';
};

export type JobType = {
  description: string;
  price: number;
  paid?: boolean;
  paymentDate?: string;
  Contract: ContractType;
};
