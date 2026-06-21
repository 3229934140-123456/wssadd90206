export interface Customer {
  id: string;
  name: string;
  phone: string;
  age: number;
  avatar: string;
  level: 'VIP' | '普通' | '新客';
  status: '待咨询' | '咨询中' | '待确认' | '治疗中' | '恢复中' | '已完成';
  lastVisit: string;
  nextAppointment?: string;
  tags: string[];
  concernAreas: string[];
  budgetRange?: string;
}

export interface DemandRecord {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  concernTags: string[];
  worryTags: string[];
  budgetRange: string;
  markedAreas: MarkedArea[];
  notes: string;
  consultant: string;
}

export interface MarkedArea {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  label: string;
}

export interface TreatmentPlan {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  doctor: string;
  status: '待确认' | '已确认' | '已拒绝';
  injectionPoints: InjectionPoint[];
  totalDosage: string;
  estimatedPrice: number;
  contraindications: string[];
  confirmedByCustomer?: boolean;
  confirmedAt?: string;
}

export interface InjectionPoint {
  id: string;
  name: string;
  area: string;
  product: string;
  dosage: string;
  price: number;
  x: number;
  y: number;
}

export interface FollowupRecord {
  id: string;
  customerId: string;
  customerName: string;
  treatmentDate: string;
  stage: 'day1' | 'day7' | 'day14' | 'completed';
  stageLabel: string;
  status: '待回访' | '进行中' | '已完成';
  photos: string[];
  feedback: string;
  discomfortTags: string[];
  hasDiscomfort: boolean;
  needDoctorReview: boolean;
  rebookIntent: '高' | '中' | '低' | '未提及';
  nextFollowupDate?: string;
}

export interface SatisfactionRecord {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  overallRating: number;
  effectRating: number;
  serviceRating: number;
  comment: string;
  tags: string[];
}

export interface TagItem {
  id: string;
  label: string;
  category: 'concern' | 'worry' | 'discomfort' | 'contraindication';
}
