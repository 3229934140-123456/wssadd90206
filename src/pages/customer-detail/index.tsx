import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { mockCustomers, mockDemandRecords, mockTreatmentPlans, mockFollowupRecords } from '@/data/mockData';
import SectionTitle from '@/components/SectionTitle';
import styles from './index.module.scss';

const CustomerDetailPage: React.FC = () => {
  const router = useRouter();
  const customerId = router.params.id || 'c001';
  
  const customer = mockCustomers.find(c => c.id === customerId) || mockCustomers[0];
  const demandRecords = mockDemandRecords.filter(d => d.customerId === customerId);
  const treatmentPlans = mockTreatmentPlans.filter(p => p.customerId === customerId);
  const followupRecords = mockFollowupRecords.filter(f => f.customerId === customerId);

  const steps = [
    { label: '诉求记录', status: 'done' },
    { label: '方案确认', status: customer.status === '待咨询' || customer.status === '咨询中' ? 'active' : 'done' },
    { label: '治疗中', status: customer.status === '待确认' || customer.status === '治疗中' ? 'active' : 'done' },
    { label: '术后恢复', status: customer.status === '恢复中' ? 'active' : 'done' },
    { label: '已完成', status: customer.status === '已完成' ? 'active' : 'pending' }
  ];

  const quickActions = [
    { icon: '📝', label: '诉求记录', url: `/pages/demand-detail/index?customerId=${customerId}` },
    { icon: '📋', label: '方案确认', url: `/pages/plan-detail/index?customerId=${customerId}` },
    { icon: '📸', label: '术后回访', url: `/pages/followup-detail/index?customerId=${customerId}` },
    { icon: '⭐', label: '满意度', url: '' }
  ];

  const handleAction = (url: string, label: string) => {
    if (url) {
      Taro.navigateTo({ url });
    } else {
      Taro.showToast({ title: `${label}功能`, icon: 'none' });
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.customerInfo}>
          <Image
            className={styles.avatar}
            src={customer.avatar}
            mode="aspectFill"
          />
          <View className={styles.info}>
            <Text className={styles.name}>{customer.name}</Text>
            <Text className={styles.meta}>{customer.phone} · {customer.age}岁 · {customer.level}</Text>
            <View className={styles.tags}>
              {customer.tags.slice(0, 4).map((tag, i) => (
                <Text key={i} className={styles.tag}>{tag}</Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      <ScrollView scrollY className={styles.content}>
        <View className={styles.quickActions}>
          {quickActions.map((action, index) => (
            <View
              key={index}
              className={styles.actionItem}
              onClick={() => handleAction(action.url, action.label)}
            >
              <Text className={styles.actionIcon}>{action.icon}</Text>
              <Text className={styles.actionLabel}>{action.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <SectionTitle title="服务进度" />
          <View className={styles.card}>
            <View className={styles.progressSteps}>
              <View className={styles.stepLine} />
              {steps.map((step, index) => (
                <View key={index} className={styles.step}>
                  <View className={classnames(
                    styles.stepDot,
                    step.status === 'done' && styles.stepDone,
                    step.status === 'active' && styles.stepActive
                  )}>
                    {step.status === 'done' ? '✓' : index + 1}
                  </View>
                  <Text className={classnames(
                    styles.stepLabel,
                    step.status === 'active' && styles.stepLabelActive
                  )}>
                    {step.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="基本信息" />
          <View className={styles.card}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>客户状态</Text>
              <Text className={styles.infoValue}>{customer.status}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>客户等级</Text>
              <Text className={styles.infoValue}>{customer.level}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>预算范围</Text>
              <Text className={styles.infoValue}>{customer.budgetRange || '未设置'}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>上次到店</Text>
              <Text className={styles.infoValue}>{customer.lastVisit}</Text>
            </View>
            {customer.nextAppointment && (
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>下次预约</Text>
                <Text className={styles.infoValue}>{customer.nextAppointment}</Text>
              </View>
            )}
          </View>
        </View>

        {demandRecords.length > 0 && (
          <View className={styles.section}>
            <SectionTitle title="诉求记录" extra="查看全部" />
            <View className={styles.card}>
              {demandRecords.map(record => (
                <View
                  key={record.id}
                  className={styles.recordItem}
                  onClick={() => Taro.navigateTo({ url: `/pages/demand-detail/index?id=${record.id}` })}
                >
                  <View className={styles.recordHeader}>
                    <Text className={styles.recordTitle}>{record.date} 诉求记录</Text>
                    <Text className={styles.recordDate}>{record.consultant}</Text>
                  </View>
                  <Text className={styles.recordDesc}>
                    改善部位：{record.concernTags.join('、')}
                  </Text>
                  <Text className={styles.recordDesc}>
                    预算：{record.budgetRange}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {treatmentPlans.length > 0 && (
          <View className={styles.section}>
            <SectionTitle title="治疗方案" extra="查看全部" />
            <View className={styles.card}>
              {treatmentPlans.map(plan => (
                <View
                  key={plan.id}
                  className={styles.recordItem}
                  onClick={() => Taro.navigateTo({ url: `/pages/plan-detail/index?id=${plan.id}` })}
                >
                  <View className={styles.recordHeader}>
                    <Text className={styles.recordTitle}>{plan.date} 方案</Text>
                    <Text className={styles.recordDate}>{plan.status}</Text>
                  </View>
                  <Text className={styles.recordDesc}>
                    {plan.doctor} · {plan.injectionPoints.length}个点位 · ¥{plan.estimatedPrice.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {followupRecords.length > 0 && (
          <View className={styles.section}>
            <SectionTitle title="回访记录" extra="查看全部" />
            <View className={styles.card}>
              {followupRecords.map(record => (
                <View
                  key={record.id}
                  className={styles.recordItem}
                  onClick={() => Taro.navigateTo({ url: `/pages/followup-detail/index?id=${record.id}` })}
                >
                  <View className={styles.recordHeader}>
                    <Text className={styles.recordTitle}>{record.stageLabel}</Text>
                    <Text className={styles.recordDate}>{record.status}</Text>
                  </View>
                  <Text className={styles.recordDesc}>
                    治疗日：{record.treatmentDate}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CustomerDetailPage;
