export interface ApiKey {
    id: string;
    key: string;
    userId: string;
    plan: 'FREE' | 'PRO' | 'BUSINESS';
    createdAt: Date;
    lastUsed: Date;
  }