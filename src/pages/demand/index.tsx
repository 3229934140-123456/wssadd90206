import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { concernTags, worryTags } from '@/data/mockData';
import { useAppStore } from '@/store';
import SectionTitle from '@/components/SectionTitle';
import StatCard from '@/components/StatCard';
import FaceMap from '@/components/FaceMap';
import styles from './index.module.scss';

const DemandPage: React.FC = () => {
  const { customers, demandRecords } = useAppStore();
  const [refreshKey, setRefreshKey] = useState(0);

  useDidShow(() => {
    setRefreshKey(prev => prev + 1);
  });

  const recentRecords = useMemo(() => 
    demandRecords.slice(0, 5),
    [demandRecords, refreshKey]
  );

  const topConcerns = concernTags.slice(0, 6).map(tag => ({
    ...tag,
    count: Math.floor(Math.random() * 20) + 5
  }));

  const topWorries = worryTags.slice(0, 4).map(tag => ({
    ...tag,
    count: Math.floor(Math.random() * 15) + 3
  }));

  const handleNewRecord = () => {
    const selectableCustomers = customers.filter(c => c.status === '待咨询' || c.status === '咨询中');
    if (selectableCustomers.length === 0) {
      Taro.showToast({ title: '暂无可选客户', icon: 'none' });
      return;
    }
    
    Taro.showActionSheet({
      itemList: selectableCustomers.slice(0, 5).map(c => `${c.name} · ${c.phone.slice(-4)}`),
      success: (res) => {
        const customer = selectableCustomers[res.tapIndex];
        Taro.navigateTo({
          url: `/pages/demand-detail/index?customerId=${customer.id}`
        });
      }
    });
  };

  const handleDemandClick = (recordId: string) => {
    Taro.navigateTo({
      url: `/pages/demand-detail/index?id=${recordId}`
    });
  };

  const stats = [
    { value: demandRecords.length, label: '本周记录', icon: '📝', color: 'secondary' as const },
    { value: concernTags.length, label: '热门诉求', icon: '🔥', color: 'warning' as const },
    { value: customers.filter(c => c.status === '咨询中').length, label: '待跟进', icon: '⏳', color: 'primary' as const }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.pageTitle}>诉求记录</Text>
        <Text className={styles.pageDesc}>记录客户需求，为方案制定提供依据</Text>
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

        <View className={styles.quickEntry} onClick={handleNewRecord}>
          <View className={styles.quickIcon}>
            <Text>✏️</Text>
          </View>
          <View className={styles.quickContent}>
            <Text className={styles.quickTitle}>快速记录诉求</Text>
            <Text className={styles.quickDesc}>选择客户，开始记录需求</Text>
          </View>
          <Text className={styles.quickArrow}>›</Text>
        </View>

        <View className={styles.section}>
          <SectionTitle title="热门诉求标签" subTitle="了解客户最关心什么" />
          <View className={styles.tagCloudSection}>
            <Text className={styles.tagCloudTitle}>
              <Text className={styles.tagIcon}>💜</Text>
              改善部位
            </Text>
            <View className={styles.popularTags}>
              {topConcerns.map(tag => (
                <View key={tag.id} className={`${styles.popularTag} ${styles.tagPurple}`}>
                  <Text>{tag.label}</Text>
                  <Text className={styles.tagCount}>{tag.count}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.tagCloudSection}>
            <Text className={styles.tagCloudTitle}>
              <Text className={styles.tagIcon}>😟</Text>
              常见顾虑
            </Text>
            <View className={styles.popularTags}>
              {topWorries.map(tag => (
                <View key={tag.id} className={`${styles.popularTag} ${styles.tagOrange}`}>
                  <Text>{tag.label}</Text>
                  <Text className={styles.tagCount}>{tag.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="最近记录" extra="查看全部" />
          
          {recentRecords.length > 0 ? (
            recentRecords.map((record) => {
              const customer = customers.find(c => c.id === record.customerId);
              return (
                <View
                  key={record.id}
                  className={styles.demandCard}
                  onClick={() => handleDemandClick(record.id)}
                >
                  <View className={styles.demandCardHeader}>
                    <Image
                      className={styles.demandAvatar}
                      src={customer?.avatar || 'https://picsum.photos/id/64/200/200'}
                      mode="aspectFill"
                    />
                    <View className={styles.demandInfo}>
                      <Text className={styles.demandName}>{record.customerName}</Text>
                      <Text className={styles.demandDate}>{record.date} · {record.consultant}</Text>
                    </View>
                  </View>

                  {record.markedAreas && record.markedAreas.length > 0 && (
                    <View className={styles.markedAreasRow}>
                      <View className={styles.miniFaceMap}>
                        <FaceMap markedAreas={record.markedAreas} />
                      </View>
                      <View className={styles.markedAreasList}>
                        <Text className={styles.markedAreasLabel}>圈选部位：</Text>
                        <View className={styles.markedTags}>
                          {record.markedAreas.slice(0, 5).map((area, i) => (
                            <View key={area.id} className={styles.markedTag} style={{ backgroundColor: area.color + '20', borderColor: area.color }}>
                              <Text style={{ color: area.color }}>{area.label}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}

                  <View className={styles.demandMetaRow}>
                    <View className={styles.demandMetaItem}>
                      <Text className={styles.metaLabel}>改善部位</Text>
                      <View className={styles.demandTags}>
                        {record.concernTags.slice(0, 3).map((tag, i) => (
                          <Text key={i} className={styles.miniTag}>{tag}</Text>
                        ))}
                        {record.concernTags.length === 0 && <Text className={styles.metaEmpty}>未记录</Text>}
                      </View>
                    </View>
                  </View>

                  <View className={styles.demandMetaRow}>
                    <View className={styles.demandMetaItem}>
                      <Text className={styles.metaLabel}>客户顾虑</Text>
                      <View className={styles.demandTags}>
                        {record.worryTags.slice(0, 3).map((tag, i) => (
                          <Text key={`w${i}`} className={`${styles.miniTag} ${styles.worryTag}`}>{tag}</Text>
                        ))}
                        {record.worryTags.length === 0 && <Text className={styles.metaEmpty}>未记录</Text>}
                      </View>
                    </View>
                  </View>

                  <View className={styles.demandMetaRow}>
                    <Text className={styles.metaLabel}>预算范围</Text>
                    <Text className={styles.budgetValue}>{record.budgetRange || '未设置'}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📝</Text>
              <Text className={styles.emptyText}>暂无诉求记录</Text>
              <View className={styles.emptyBtn} onClick={handleNewRecord}>
                <Text>立即记录</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DemandPage;
