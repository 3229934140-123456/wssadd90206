import { Customer, DemandRecord, TreatmentPlan, FollowupRecord, SatisfactionRecord, TagItem } from '@/types';

export const mockCustomers: Customer[] = [
  {
    id: 'c001',
    name: '张小姐',
    phone: '138****8888',
    age: 28,
    avatar: 'https://picsum.photos/id/64/200/200',
    level: 'VIP',
    status: '恢复中',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-22',
    tags: ['法令纹', '苹果肌', '怕疼'],
    concernAreas: ['法令纹', '苹果肌'],
    budgetRange: '1-2万'
  },
  {
    id: 'c002',
    name: '李女士',
    phone: '139****6666',
    age: 35,
    avatar: 'https://picsum.photos/id/91/200/200',
    level: '普通',
    status: '待确认',
    lastVisit: '2024-01-18',
    tags: ['瘦脸', '咬肌大', '预算有限'],
    concernAreas: ['咬肌'],
    budgetRange: '5千-1万'
  },
  {
    id: 'c003',
    name: '王小姐',
    phone: '137****5555',
    age: 25,
    avatar: 'https://picsum.photos/id/177/200/200',
    level: '新客',
    status: '咨询中',
    lastVisit: '2024-01-20',
    tags: ['隆鼻', '怕僵硬', '初次体验'],
    concernAreas: ['鼻梁'],
    budgetRange: '1-2万'
  },
  {
    id: 'c004',
    name: '陈女士',
    phone: '136****4444',
    age: 40,
    avatar: 'https://picsum.photos/id/338/200/200',
    level: 'VIP',
    status: '已完成',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-02-10',
    tags: ['除皱', '抬头纹', '鱼尾纹'],
    concernAreas: ['额头', '眼周'],
    budgetRange: '2-3万'
  },
  {
    id: 'c005',
    name: '赵小姐',
    phone: '135****3333',
    age: 30,
    avatar: 'https://picsum.photos/id/1027/200/200',
    level: '普通',
    status: '治疗中',
    lastVisit: '2024-01-21',
    tags: ['丰唇', 'M唇', '自然款'],
    concernAreas: ['嘴唇'],
    budgetRange: '5千-1万'
  },
  {
    id: 'c006',
    name: '孙女士',
    phone: '134****2222',
    age: 32,
    avatar: 'https://picsum.photos/id/659/200/200',
    level: '新客',
    status: '待咨询',
    lastVisit: '-',
    tags: ['咨询'],
    concernAreas: [],
    budgetRange: undefined
  },
  {
    id: 'c007',
    name: '周小姐',
    phone: '133****1111',
    age: 27,
    avatar: 'https://picsum.photos/id/718/200/200',
    level: '普通',
    status: '恢复中',
    lastVisit: '2024-01-19',
    tags: ['下颌缘', '紧致'],
    concernAreas: ['下颌线'],
    budgetRange: '1-2万'
  },
  {
    id: 'c008',
    name: '吴女士',
    phone: '132****9999',
    age: 45,
    avatar: 'https://picsum.photos/id/237/200/200',
    level: 'VIP',
    status: '已完成',
    lastVisit: '2024-01-05',
    nextAppointment: '2024-02-05',
    tags: ['全面部', '紧致提升', '抗衰'],
    concernAreas: ['全面部'],
    budgetRange: '3万以上'
  }
];

export const concernTags: TagItem[] = [
  { id: 't1', label: '法令纹', category: 'concern' },
  { id: 't2', label: '苹果肌', category: 'concern' },
  { id: 't3', label: '瘦脸', category: 'concern' },
  { id: 't4', label: '隆鼻', category: 'concern' },
  { id: 't5', label: '丰唇', category: 'concern' },
  { id: 't6', label: '抬头纹', category: 'concern' },
  { id: 't7', label: '鱼尾纹', category: 'concern' },
  { id: 't8', label: '川字纹', category: 'concern' },
  { id: 't9', label: '下颌缘', category: 'concern' },
  { id: 't10', label: '太阳穴', category: 'concern' },
  { id: 't11', label: '下巴', category: 'concern' },
  { id: 't12', label: '泪沟', category: 'concern' },
  { id: 't13', label: '黑眼圈', category: 'concern' },
  { id: 't14', label: '咬肌', category: 'concern' },
  { id: 't15', label: '全面部提升', category: 'concern' }
];

export const worryTags: TagItem[] = [
  { id: 'w1', label: '怕疼', category: 'worry' },
  { id: 'w2', label: '怕僵硬', category: 'worry' },
  { id: 'w3', label: '怕肿', category: 'worry' },
  { id: 'w4', label: '怕淤青', category: 'worry' },
  { id: 'w5', label: '怕不自然', category: 'worry' },
  { id: 'w6', label: '怕过敏', category: 'worry' },
  { id: 'w7', label: '预算有限', category: 'worry' },
  { id: 'w8', label: '恢复期长', category: 'worry' },
  { id: 'w9', label: '初次体验', category: 'worry' },
  { id: 'w10', label: '担心效果', category: 'worry' }
];

export const discomfortTags: TagItem[] = [
  { id: 'd1', label: '红肿', category: 'discomfort' },
  { id: 'd2', label: '淤青', category: 'discomfort' },
  { id: 'd3', label: '疼痛', category: 'discomfort' },
  { id: 'd4', label: '瘙痒', category: 'discomfort' },
  { id: 'd5', label: '表情不对称', category: 'discomfort' },
  { id: 'd6', label: '硬块', category: 'discomfort' },
  { id: 'd7', label: '肿胀', category: 'discomfort' },
  { id: 'd8', label: '轻微麻木', category: 'discomfort' }
];

export const contraindicationTags: TagItem[] = [
  { id: 'ci1', label: '孕期/哺乳期', category: 'contraindication' },
  { id: 'ci2', label: '过敏体质', category: 'contraindication' },
  { id: 'ci3', label: '近期服用阿司匹林', category: 'contraindication' },
  { id: 'ci4', label: '皮肤感染期', category: 'contraindication' },
  { id: 'ci5', label: '免疫力低下', category: 'contraindication' },
  { id: 'ci6', label: '疤痕体质', category: 'contraindication' },
  { id: 'ci7', label: '近期暴晒', category: 'contraindication' },
  { id: 'ci8', label: '月经期', category: 'contraindication' }
];

export const mockDemandRecords: DemandRecord[] = [
  {
    id: 'd001',
    customerId: 'c001',
    customerName: '张小姐',
    date: '2024-01-15',
    concernTags: ['法令纹', '苹果肌'],
    worryTags: ['怕疼', '怕不自然'],
    budgetRange: '1-2万',
    markedAreas: [
      { id: 'm1', x: 35, y: 55, radius: 12, color: '#FF4D4F', label: '法令纹' },
      { id: 'm2', x: 60, y: 45, radius: 10, color: '#1890FF', label: '苹果肌' }
    ],
    notes: '客户想要自然款，不喜欢太夸张的效果，关注恢复期',
    consultant: '小美'
  },
  {
    id: 'd002',
    customerId: 'c002',
    customerName: '李女士',
    date: '2024-01-18',
    concernTags: ['瘦脸', '咬肌'],
    worryTags: ['预算有限', '担心效果'],
    budgetRange: '5千-1万',
    markedAreas: [
      { id: 'm3', x: 25, y: 60, radius: 10, color: '#52C41A', label: '咬肌' }
    ],
    notes: '咬肌比较发达，想打瘦脸针，预算比较紧',
    consultant: '小美'
  },
  {
    id: 'd003',
    customerId: 'c003',
    customerName: '王小姐',
    date: '2024-01-20',
    concernTags: ['隆鼻', '下巴'],
    worryTags: ['怕僵硬', '初次体验', '怕疼'],
    budgetRange: '1-2万',
    markedAreas: [
      { id: 'm4', x: 50, y: 40, radius: 8, color: '#FAAD14', label: '鼻梁' },
      { id: 'm5', x: 50, y: 75, radius: 10, color: '#722ED1', label: '下巴' }
    ],
    notes: '第一次做医美，比较紧张，想要自然的翘鼻',
    consultant: '丽丽'
  }
];

export const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: 'p001',
    customerId: 'c001',
    customerName: '张小姐',
    date: '2024-01-16',
    doctor: '王医生',
    status: '已确认',
    injectionPoints: [
      { id: 'ip1', name: '法令纹（左）', area: '法令纹', product: '乔雅登雅致', dosage: '0.8ml', price: 6800, x: 38, y: 58 },
      { id: 'ip2', name: '法令纹（右）', area: '法令纹', product: '乔雅登雅致', dosage: '0.8ml', price: 6800, x: 62, y: 58 },
      { id: 'ip3', name: '苹果肌（左）', area: '苹果肌', product: '乔雅登极致', dosage: '0.6ml', price: 5800, x: 35, y: 45 },
      { id: 'ip4', name: '苹果肌（右）', area: '苹果肌', product: '乔雅登极致', dosage: '0.6ml', price: 5800, x: 65, y: 45 }
    ],
    totalDosage: '2.8ml',
    estimatedPrice: 25200,
    contraindications: ['过敏体质'],
    confirmedByCustomer: true,
    confirmedAt: '2024-01-16 15:30'
  },
  {
    id: 'p002',
    customerId: 'c002',
    customerName: '李女士',
    date: '2024-01-19',
    doctor: '李医生',
    status: '待确认',
    injectionPoints: [
      { id: 'ip5', name: '咬肌（左）', area: '咬肌', product: '衡力', dosage: '50U', price: 1800, x: 28, y: 62 },
      { id: 'ip6', name: '咬肌（右）', area: '咬肌', product: '衡力', dosage: '50U', price: 1800, x: 72, y: 62 }
    ],
    totalDosage: '100U',
    estimatedPrice: 3200,
    contraindications: [],
    confirmedByCustomer: false
  },
  {
    id: 'p003',
    customerId: 'c004',
    customerName: '陈女士',
    date: '2024-01-12',
    doctor: '王医生',
    status: '已确认',
    injectionPoints: [
      { id: 'ip7', name: '抬头纹', area: '额头', product: '保妥适', dosage: '20U', price: 3800, x: 50, y: 18 },
      { id: 'ip8', name: '鱼尾纹（左）', area: '眼周', product: '保妥适', dosage: '8U', price: 1800, x: 30, y: 32 },
      { id: 'ip9', name: '鱼尾纹（右）', area: '眼周', product: '保妥适', dosage: '8U', price: 1800, x: 70, y: 32 },
      { id: 'ip10', name: '川字纹', area: '眉间', product: '保妥适', dosage: '12U', price: 2200, x: 50, y: 28 }
    ],
    totalDosage: '48U',
    estimatedPrice: 9600,
    contraindications: ['近期服用阿司匹林'],
    confirmedByCustomer: true,
    confirmedAt: '2024-01-12 10:00'
  }
];

export const mockFollowupRecords: FollowupRecord[] = [
  {
    id: 'f001',
    customerId: 'c001',
    customerName: '张小姐',
    treatmentDate: '2024-01-18',
    stage: 'day7',
    stageLabel: '术后第7天',
    status: '进行中',
    photos: ['https://picsum.photos/id/64/400/400'],
    feedback: '感觉消肿了一些，还有点淤青，笑起来有点不自然',
    discomfortTags: ['淤青', '表情不对称'],
    hasDiscomfort: true,
    needDoctorReview: true,
    rebookIntent: '高',
    nextFollowupDate: '2024-01-25'
  },
  {
    id: 'f002',
    customerId: 'c005',
    customerName: '赵小姐',
    treatmentDate: '2024-01-21',
    stage: 'day1',
    stageLabel: '术后第1天',
    status: '待回访',
    photos: [],
    feedback: '',
    discomfortTags: [],
    hasDiscomfort: false,
    needDoctorReview: false,
    rebookIntent: '未提及'
  },
  {
    id: 'f003',
    customerId: 'c007',
    customerName: '周小姐',
    treatmentDate: '2024-01-19',
    stage: 'day1',
    stageLabel: '术后第1天',
    status: '已完成',
    photos: ['https://picsum.photos/id/177/400/400'],
    feedback: '有点肿，不疼，感觉还好',
    discomfortTags: ['肿胀'],
    hasDiscomfort: false,
    needDoctorReview: false,
    rebookIntent: '中',
    nextFollowupDate: '2024-01-26'
  },
  {
    id: 'f004',
    customerId: 'c004',
    customerName: '陈女士',
    treatmentDate: '2024-01-15',
    stage: 'day14',
    stageLabel: '术后第14天',
    status: '已完成',
    photos: ['https://picsum.photos/id/338/400/400', 'https://picsum.photos/id/91/400/400'],
    feedback: '效果很好，皱纹明显变淡了，朋友们都说我看起来年轻了',
    discomfortTags: [],
    hasDiscomfort: false,
    needDoctorReview: false,
    rebookIntent: '高'
  }
];

export const mockSatisfactionRecords: SatisfactionRecord[] = [
  {
    id: 's001',
    customerId: 'c004',
    customerName: '陈女士',
    date: '2024-01-20',
    overallRating: 5,
    effectRating: 5,
    serviceRating: 5,
    comment: '医生技术很好，效果很满意，顾问也很贴心，每次回访都很及时',
    tags: ['效果好', '服务好', '医生专业']
  },
  {
    id: 's002',
    customerId: 'c008',
    customerName: '吴女士',
    date: '2024-01-15',
    overallRating: 5,
    effectRating: 4,
    serviceRating: 5,
    comment: '整体很不错，环境很好，服务也很到位',
    tags: ['环境好', '服务好', '性价比高']
  },
  {
    id: 's003',
    customerId: 'c007',
    customerName: '周小姐',
    date: '2024-01-18',
    overallRating: 4,
    effectRating: 4,
    serviceRating: 5,
    comment: '服务很满意，效果还在恢复中，期待后续',
    tags: ['服务好', '恢复中']
  }
];

export const budgetRanges = [
  '5千以下',
  '5千-1万',
  '1-2万',
  '2-3万',
  '3万以上'
];

export const followupScripts = [
  {
    stage: 'day1',
    title: '术后第1天回访话术',
    content: '亲爱的XX，今天是您术后第一天，感觉怎么样呀？有没有什么不舒服的地方？记得今天要多休息，不要按压注射部位，6小时内不要碰水哦~ 如果有任何问题随时联系我哒💕'
  },
  {
    stage: 'day7',
    title: '术后第7天回访话术',
    content: '亲爱的XX，术后一周啦，现在感觉怎么样？效果开始慢慢显现了吗？这时候还有点肿是正常的哦，有什么疑问随时和我说~ 方便的话可以拍张照片给我看看恢复情况哦📷'
  },
  {
    stage: 'day14',
    title: '术后第14天回访话术',
    content: '亲爱的XX，两周时间到啦，效果应该已经很明显了吧？对效果还满意吗？如果感觉不错的话，记得下次补针提前预约哦~ 有任何问题随时联系我😊'
  }
];
