import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAppStore } from '@/store';
import SectionTitle from '@/components/SectionTitle';
import StatCard from '@/components/StatCard';
import styles from './index.module.scss';

const SatisfactionPage: React.FC = () => {
  const { customers, satisfactionRecords, followupRecords } = useAppStore();
  const [, setRefreshKey] = useState(0);

  useDidShow(() => {
    setRefreshKey(prev => prev + 1);
  });

  const avgOverall = satisfactionRecords.length > 0 ? (
    satisfactionRecords.reduce((sum, r) => sum + r.overallRating, 0) / satisfactionRecords.length
  ).toFixed(1) : '0.0';

  const avgEffect = satisfactionRecords.length > 0 ? (
    satisfactionRecords.reduce((sum, r) => sum + r.effectRating, 0) / satisfactionRecords.length
  ).toFixed(1) : '0.0';

  const avgService = satisfactionRecords.length > 0 ? (
    satisfactionRecords.reduce((sum, r) => sum + r.serviceRating, 0) / satisfactionRecords.length
  ).toFixed(1) : '0.0';

  const renderStars = (count: number) => {
    return '⭐'.repeat(count) + '☆'.repeat(5 - count);
  };

  const pendingReviews = followupRecords
    .filter(f => f.status === '已完成' && f.stage === 'day14')
    .slice(0, 3);

  const handleSendReview = (customerName: string) => {
    Taro.showToast({
      title: `已向${customerName}发送评价邀请`,
      icon: 'success'
    });
  };

  const stats = [
    { value: satisfactionRecords.length, label: '评价总数', icon: '📝', color: 'warning' as const },
    { value: avgOverall, label: '平均分', icon: '⭐', color: 'primary' as const },
    { value: '92%', label: '好评率', icon: '😊', color: 'success' as const }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.pageTitle}>满意评价</Text>
        <Text className={styles.pageDesc}>收集客户反馈，持续提升服务质量</Text>
      </View>

      <ScrollView scrollY className={styles.content}>
        <View className={styles.overallCard}>
          <Text className={styles.overallScore}>{avgOverall}</Text>
          <Text className={styles.overallStars}>{renderStars(Math.round(parseFloat(avgOverall)))}</Text>
          <Text className={styles.overallLabel}>综合满意度评分</Text>
          
          <View className={styles.scoreBreakdown}>
            <View className={styles.scoreItem}>
              <Text className={styles.scoreValue}>{avgEffect}</Text>
              <Text className={styles.scoreLabel}>效果评分</Text>
            </View>
            <View className={styles.scoreItem}>
              <Text className={styles.scoreValue}>{avgService}</Text>
              <Text className={styles.scoreLabel}>服务评分</Text>
            </View>
            <View className={styles.scoreItem}>
              <Text className={styles.scoreValue}>4.9</Text>
              <Text className={styles.scoreLabel}>环境评分</Text>
            </View>
          </View>
        </View>

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

        {pendingReviews.length > 0 && (
          <View className={styles.section}>
            <SectionTitle title="待邀请评价" subTitle="术后14天可邀请客户评价" />
            <View className={styles.pendingList}>
              {pendingReviews.map(record => {
                const customer = customers.find(c => c.id === record.customerId);
                return (
                  <View key={record.id} className={styles.pendingItem}>
                    <Image
                      className={styles.pendingAvatar}
                      src={customer?.avatar || 'https://picsum.photos/id/64/200/200'}
                      mode="aspectFill"
                    />
                    <View className={styles.pendingInfo}>
                      <Text className={styles.pendingName}>{record.customerName}</Text>
                      <Text className={styles.pendingDesc}>治疗结束 7 天，可邀请评价</Text>
                    </View>
                    <View
                      className={styles.pendingBtn}
                      onClick={() => handleSendReview(record.customerName)}
                    >
                      <Text>邀请评价</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View className={styles.section}>
          <SectionTitle title="最新评价" extra={`共 ${satisfactionRecords.length} 条`} />
          
          {satisfactionRecords.length > 0 ? (
            satisfactionRecords.map(record => {
              const customer = customers.find(c => c.id === record.customerId);
              return (
                <View key={record.id} className={styles.reviewCard}>
                  <View className={styles.reviewHeader}>
                    <Image
                      className={styles.reviewAvatar}
                      src={customer?.avatar || 'https://picsum.photos/id/64/200/200'}
                      mode="aspectFill"
                    />
                    <View className={styles.reviewInfo}>
                      <Text className={styles.reviewName}>{record.customerName}</Text>
                      <Text className={styles.reviewDate}>{record.date}</Text>
                    </View>
                    <Text className={styles.reviewStars}>
                      {renderStars(record.overallRating)}
                    </Text>
                  </View>
                  
                  <Text className={styles.reviewContent}>{record.comment}</Text>
                  
                  {record.tags.length > 0 && (
                    <View className={styles.reviewTags}>
                      {record.tags.map((tag, i) => (
                        <Text key={i} className={styles.reviewTag}>{tag}</Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📭</Text>
              <Text className={styles.emptyText}>暂无评价记录</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SatisfactionPage;
