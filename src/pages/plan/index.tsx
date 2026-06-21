import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockTreatmentPlans, mockCustomers } from '@/data/mockData';
import SectionTitle from '@/components/SectionTitle';
import StatCard from '@/components/StatCard';
import styles from './index.module.scss';

const PlanPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('全部');
  const tabs = ['全部', '待确认', '已确认'];

  const pendingPlans = mockTreatmentPlans.filter(p => p.status === '待确认');
  const confirmedPlans = mockTreatmentPlans.filter(p => p.status === '已确认');

  const filteredPlans = mockTreatmentPlans.filter(plan => {
    if (activeTab === '全部') return true;
    return plan.status === activeTab;
  });

  const handlePlanClick = (planId: string) => {
    Taro.navigateTo({
      url: `/pages/plan-detail/index?id=${planId}`
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case '待确认': return styles.statusPending;
      case '已确认': return styles.statusConfirmed;
      case '已拒绝': return styles.statusRejected;
      default: return styles.statusPending;
    }
  };

  const stats = [
    { value: mockTreatmentPlans.length, label: '方案总数', icon: '📋', color: 'primary' as const },
    { value: pendingPlans.length, label: '待确认', icon: '⏳', color: 'warning' as const },
    { value: confirmedPlans.length, label: '已确认', icon: '✅', color: 'success' as const }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.pageTitle}>方案确认</Text>
        <Text className={styles.pageDesc}>转述医生方案，与客户确认项目细节</Text>
      </View>

      <ScrollView scrollY className={styles.content}>
        <View className={styles.statsRow}>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </View>

        <View className={styles.section}>
          <SectionTitle title="待确认方案" subTitle="请优先跟进" />
          
          {pendingPlans.length > 0 ? (
            pendingPlans.map(plan => {
              const customer = mockCustomers.find(c => c.id === plan.customerId);
              return (
                <View
                  key={plan.id}
                  className={styles.planCard}
                  onClick={() => handlePlanClick(plan.id)}
                >
                  <View className={styles.planHeader}>
                    <Image
                      className={styles.planAvatar}
                      src={customer?.avatar || 'https://picsum.photos/id/64/200/200'}
                      mode="aspectFill"
                    />
                    <View className={styles.planInfo}>
                      <Text className={styles.planName}>{plan.customerName}</Text>
                      <Text className={styles.planMeta}>
                        {plan.date} · {plan.doctor}
                      </Text>
                    </View>
                    <View className={classnames(styles.planStatus, getStatusClass(plan.status))}>
                      <Text>{plan.status}</Text>
                    </View>
                  </View>

                  <View className={styles.planBody}>
                    <View className={styles.planPoints}>
                      <Text className={styles.pointsTitle}>点位数量</Text>
                      <Text className={styles.pointsValue}>{plan.injectionPoints.length} 个</Text>
                    </View>
                    <View className={styles.planPrice}>
                      <Text className={styles.priceTitle}>预估费用</Text>
                      <Text className={styles.priceValue}>¥{plan.estimatedPrice.toLocaleString()}</Text>
                    </View>
                  </View>

                  <View className={styles.planFooter}>
                    <View className={styles.doctorInfo}>
                      <Text className={styles.doctorIcon}>👨‍⚕️</Text>
                      <Text>{plan.doctor} 制定</Text>
                    </View>
                    <Text className={styles.viewDetail}>查看详情 →</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🎉</Text>
              <Text className={styles.emptyText}>暂无待确认方案</Text>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <SectionTitle title="确认流程" subTitle="方案确认标准步骤" />
          <View className={styles.timelineCard}>
            <View className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot, styles.timelineDotDone)} />
              <View className={styles.timelineContent}>
                <Text className={styles.timelineTitle}>医生面诊</Text>
                <Text className={styles.timelineDesc}>医生根据客户诉求制定注射方案</Text>
                <Text className={styles.timelineTime}>已完成</Text>
              </View>
            </View>
            <View className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot, styles.timelineDotDone)} />
              <View className={styles.timelineContent}>
                <Text className={styles.timelineTitle}>方案转述</Text>
                <Text className={styles.timelineDesc}>顾问向客户解释方案内容和注意事项</Text>
                <Text className={styles.timelineTime}>已完成</Text>
              </View>
            </View>
            <View className={styles.timelineItem}>
              <View className={styles.timelineDot} />
              <View className={styles.timelineContent}>
                <Text className={styles.timelineTitle}>客户确认</Text>
                <Text className={styles.timelineDesc}>客户确认理解并同意治疗方案</Text>
                <Text className={styles.timelineTime}>进行中</Text>
              </View>
            </View>
            <View className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot)} />
              <View className={styles.timelineContent}>
                <Text className={styles.timelineTitle}>签署知情书</Text>
                <Text className={styles.timelineDesc}>确认治疗前禁忌和知情同意</Text>
                <Text className={styles.timelineTime}>待开始</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="全部方案" extra={`共 ${mockTreatmentPlans.length} 份`} />
          
          <View className={styles.tabRow}>
            {tabs.map(tab => (
              <View
                key={tab}
                className={classnames(styles.tabItem, activeTab === tab && styles.active)}
                onClick={() => setActiveTab(tab)}
              >
                <Text>{tab}</Text>
              </View>
            ))}
          </View>

          {filteredPlans.length > 0 ? (
            filteredPlans.map(plan => {
              const customer = mockCustomers.find(c => c.id === plan.customerId);
              return (
                <View
                  key={plan.id}
                  className={styles.planCard}
                  onClick={() => handlePlanClick(plan.id)}
                >
                  <View className={styles.planHeader}>
                    <Image
                      className={styles.planAvatar}
                      src={customer?.avatar || 'https://picsum.photos/id/64/200/200'}
                      mode="aspectFill"
                    />
                    <View className={styles.planInfo}>
                      <Text className={styles.planName}>{plan.customerName}</Text>
                      <Text className={styles.planMeta}>
                        {plan.date} · {plan.totalDosage}
                      </Text>
                    </View>
                    <View className={classnames(styles.planStatus, getStatusClass(plan.status))}>
                      <Text>{plan.status}</Text>
                    </View>
                  </View>
                  <View className={styles.planFooter}>
                    <Text className={styles.doctorInfo}>
                      👨‍⚕️ {plan.doctor} · ¥{plan.estimatedPrice.toLocaleString()}
                    </Text>
                    <Text className={styles.viewDetail}>详情 →</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📭</Text>
              <Text className={styles.emptyText}>暂无方案记录</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PlanPage;
