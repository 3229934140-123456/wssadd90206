import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { Customer, DemandRecord, TreatmentPlan, FollowupRecord, SatisfactionRecord } from '@/types';
import {
  mockCustomers,
  mockDemandRecords,
  mockTreatmentPlans,
  mockFollowupRecords,
  mockSatisfactionRecords
} from '@/data/mockData';

interface AppState {
  customers: Customer[];
  demandRecords: DemandRecord[];
  treatmentPlans: TreatmentPlan[];
  followupRecords: FollowupRecord[];
  satisfactionRecords: SatisfactionRecord[];

  addCustomer: (customer: Omit<Customer, 'id' | 'lastVisit' | 'status'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  addDemandRecord: (record: Omit<DemandRecord, 'id' | 'date' | 'consultant'>) => void;
  updateDemandRecord: (id: string, updates: Partial<DemandRecord>) => void;

  updateTreatmentPlan: (id: string, updates: Partial<TreatmentPlan>) => void;
  confirmTreatmentPlan: (id: string) => void;

  updateFollowupRecord: (id: string, updates: Partial<FollowupRecord>) => void;
  addPhotoToFollowup: (id: string, photoUrl: string) => void;
  completeFollowup: (id: string) => void;

  resetStore: () => void;
}

const taroStorage = {
  getItem: (name: string) => {
    return new Promise<string | null>((resolve) => {
      Taro.getStorage({
        key: name,
        success: (res) => resolve(res.data),
        fail: () => resolve(null)
      });
    });
  },
  setItem: (name: string, value: string) => {
    return new Promise<void>((resolve) => {
      Taro.setStorage({ key: name, data: value });
      resolve();
    });
  },
  removeItem: (name: string) => {
    return new Promise<void>((resolve) => {
      Taro.removeStorage({ key: name });
      resolve();
    });
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      customers: mockCustomers,
      demandRecords: mockDemandRecords,
      treatmentPlans: mockTreatmentPlans,
      followupRecords: mockFollowupRecords,
      satisfactionRecords: mockSatisfactionRecords,

      addCustomer: (customer) => {
        const newCustomer: Customer = {
          ...customer,
          id: `c${Date.now()}`,
          lastVisit: new Date().toISOString().split('T')[0],
          status: '待咨询'
        };
        set((state) => ({
          customers: [newCustomer, ...state.customers]
        }));
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },

      addDemandRecord: (record) => {
        const newRecord: DemandRecord = {
          ...record,
          id: `d${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          consultant: '小美'
        };
        set((state) => ({
          demandRecords: [newRecord, ...state.demandRecords]
        }));

        const customer = get().customers.find(c => c.id === record.customerId);
        if (customer) {
          get().updateCustomer(record.customerId, {
            status: '咨询中',
            tags: [...new Set([...customer.tags, ...record.concernTags, ...record.worryTags])],
            concernAreas: [...new Set([...customer.concernAreas, ...record.concernTags])],
            budgetRange: record.budgetRange
          });
        }
      },

      updateDemandRecord: (id, updates) => {
        set((state) => ({
          demandRecords: state.demandRecords.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          )
        }));
      },

      updateTreatmentPlan: (id, updates) => {
        set((state) => ({
          treatmentPlans: state.treatmentPlans.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },

      confirmTreatmentPlan: (id) => {
        const now = new Date();
        const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        set((state) => ({
          treatmentPlans: state.treatmentPlans.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: '已确认',
                  confirmedByCustomer: true,
                  confirmedAt: timeStr
                }
              : p
          )
        }));

        const plan = get().treatmentPlans.find(p => p.id === id);
        if (plan) {
          get().updateCustomer(plan.customerId, {
            status: '治疗中'
          });
        }
      },

      updateFollowupRecord: (id, updates) => {
        set((state) => ({
          followupRecords: state.followupRecords.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          )
        }));

        const record = get().followupRecords.find(r => r.id === id);
        if (record && record.discomfortTags.length > 0) {
          get().updateFollowupRecord(id, {
            hasDiscomfort: true,
            needDoctorReview: true
          });
        }
      },

      addPhotoToFollowup: (id, photoUrl) => {
        set((state) => ({
          followupRecords: state.followupRecords.map((r) =>
            r.id === id
              ? { ...r, photos: [...r.photos, photoUrl] }
              : r
          )
        }));
      },

      completeFollowup: (id) => {
        const record = get().followupRecords.find(r => r.id === id);
        if (!record) return;

        const stageOrder = ['day1', 'day7', 'day14'];
        const currentIndex = stageOrder.indexOf(record.stage);
        const nextStage = currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : null;

        if (nextStage) {
          const treatmentDate = new Date(record.treatmentDate);
          const nextDays = nextStage === 'day7' ? 7 : 14;
          treatmentDate.setDate(treatmentDate.getDate() + nextDays);
          const nextFollowupDate = treatmentDate.toISOString().split('T')[0];

          set((state) => ({
            followupRecords: state.followupRecords.map((r) =>
              r.id === id
                ? { ...r, status: '已完成', nextFollowupDate }
                : r
            )
          }));

          const stageLabels: Record<string, string> = {
            day7: '术后第7天',
            day14: '术后第14天'
          };

          const newFollowup: FollowupRecord = {
            id: `f${Date.now()}`,
            customerId: record.customerId,
            customerName: record.customerName,
            treatmentDate: record.treatmentDate,
            stage: nextStage as 'day7' | 'day14',
            stageLabel: stageLabels[nextStage],
            status: '待回访',
            photos: [],
            feedback: '',
            discomfortTags: [],
            hasDiscomfort: false,
            needDoctorReview: false,
            rebookIntent: '未提及'
          };

          set((state) => ({
            followupRecords: [...state.followupRecords, newFollowup]
          }));
        } else {
          set((state) => ({
            followupRecords: state.followupRecords.map((r) =>
              r.id === id
                ? { ...r, status: '已完成' }
                : r
            )
          }));

          get().updateCustomer(record.customerId, {
            status: '已完成'
          });
        }
      },

      resetStore: () => {
        set({
          customers: mockCustomers,
          demandRecords: mockDemandRecords,
          treatmentPlans: mockTreatmentPlans,
          followupRecords: mockFollowupRecords,
          satisfactionRecords: mockSatisfactionRecords
        });
      }
    }),
    {
      name: 'aesthetic-consultant-storage',
      storage: createJSONStorage(() => taroStorage),
      partialize: (state) => ({
        customers: state.customers,
        demandRecords: state.demandRecords,
        treatmentPlans: state.treatmentPlans,
        followupRecords: state.followupRecords,
        satisfactionRecords: state.satisfactionRecords
      })
    }
  )
);
