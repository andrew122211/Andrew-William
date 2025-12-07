export interface UserProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  conditions: string[];
}

export interface Screening {
  name: string;
  frequency: string;
  reason: string;
  category: 'Critical' | 'Routine' | 'Optional';
}

export interface TriageResult {
  urgencyLevel: 'Emergency' | 'Urgent Care' | 'Virtual Visit' | 'Self-Care';
  summary: string;
  actionableSteps: string[];
  disclaimer: string;
}

export interface HealthResource {
  topic: string;
  summary: string;
  keyAdvice: string[];
  relatedTags: string[];
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PREVENTIVE = 'PREVENTIVE',
  SYMPTOMS = 'SYMPTOMS',
  RESOURCES = 'RESOURCES',
  PROFILE = 'PROFILE'
}