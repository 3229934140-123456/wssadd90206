import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { followupScripts } from '@/data/mockData';
import { useAppStore } from '@/store';
import SectionTitle from '@/components/SectionTitle';
import StatCard from '@/components/StatCard';
import styles from './index.module.scss';

const FollowupPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('全部');
  const [, setRefreshKey] = useState(0);
  const tabs = ['全部', '待回访', '进行中', '已完成'];

  const { customers, followupRecords } = useAppStore();

  useDidShow(() => {
    setRefreshKey(prev => prev + 1);
  });

  const pendingFollowups = followupRecords.filter(f => f.status === '待回访');
  const needReview = followupRecords.filter(f => f.needDoctorReview);
  const completedFollowups = followupRecords.filter(f => f.status === '已完成');

  const filteredRecords = followupRecords.filter(record => {
    if (activeTab === '全部') return true;
    return record.status === activeTab;
  });

  const handleFollowupClick = (recordId: string) => {
    Taro.navigateTo({
      url: `/pages/followup-detail/index?id=${recordId}`
    });
  };

  const getStageClass = (stage: string) => {
    switch (stage) {
      case 'day1': return styles.stageDay1;
      case 'day7': return styles.stageDay7;
      case 'day14': return styles.stageDay14;
      default: return styles.stageDay1;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case '待回访': return styles.statusTodo;
      case '进行中': return styles.statusDoing;
      case '已完成': return styles.statusDone;
      default: return styles.statusTodo;
    }
  };

  const stats = [
    { value: followupRecords.length, label: '回访总数', icon: '📊', color: 'success' as const },
    { value: pendingFollowups.length, label: '待回访', icon: '⏰', color: 'warning' as const },
    { value: needReview.length, label: '需复核', icon: '⚠️', color: 'error' as const },
    { value: completedFollowups.length, label: '已完成', icon: '✅', color: 'success' as const }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.pageTitle}>术后回访</Text>
        <Text className={styles.pageDesc}>跟踪恢复情况，提升客户满意度</Text>
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

        {needReview.length > 0 && (
          <View className={styles.section}>
            <SectionTitle title="需医生复核" subTitle="客户有不适反馈，请及时处理" />
            {needReview.map(record => {
              const customer = customers.find(c => c.id === record.customerId);
              return (
                <View
                  key={record.id}
                  className={styles.followupCard}
                  onClick={() => handleFollowupClick(record.id)}
                >
                  <View className={styles.cardHeader}>
                    <Image
                      className={styles.cardAvatar}
                      src={customer?.avatar || 'https://picsum.photos/id/64/200/200'}
                      mode="aspectFill"
                    />
                    <View className={styles.cardInfo}>
                      <Text className={styles.cardName}>{record.customerName}</Text>
                      <View className={styles.cardStage}>
                        <View className={classnames(styles.stageBadge, getStageClass(record.stage))}>
                          <Text>{record.stageLabel}</Text>
                        </View>
                        <Text className={styles.stageText}>治疗日：{record.treatmentDate}</Text>
                      </View>
                    </View>
                    <View className={classnames(styles.cardStatus, styles.statusTodo)}>
                      <Text>需复核</Text>
                    </View>
                  </View>
                  <View className={styles.cardBody}>
                    <View className={styles.discomfortTags}>
                      {record.discomfortTags.map((tag, i) => (
                        <Text key={i} className={styles.discomfortTag}>⚠️ {tag}</Text>
                      ))}
                    </View>
                    {record.feedback && (
                      <Text className={styles.feedbackPreview}>{record.feedback}</Text>
                    )}
                  </View>
                  <View className={styles.cardFooter}>
                    <Text className={styles.footerInfo}>
                      请尽快转给医生复核
                    </Text>
                    <Text className={styles.viewDetail}>处理 →</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View className={styles.section}>
          <SectionTitle title="回访话术参考" subTitle="点击可复制使用" />
          <View className={styles.scriptCard}>
            <Text className={styles.scriptTitle}>
              <Text className={styles.scriptIcon}>💬</Text>
              {followupScripts[0].title}
            </Text>
            <Text className={styles.scriptContent}>{followupScripts[0].content}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="回访列表" extra={`共 ${filteredRecords.length} 条`} />
          
          <ScrollView scrollX className={styles.tabRow}>
            {tabs.map(tab => (
              <View
                key={tab}
                className={classnames(styles.tabItem, activeTab === tab && styles.active)}
                onClick={() => setActiveTab(tab)}
              >
                <Text>{tab}</Text>
              </View>
            ))}
          </ScrollView>

          {filteredRecords.length > 0 ? (
            filteredRecords.map(record => {
              const customer = customers.find(c => c.id === record.customerId);
              return (
                <View
                  key={record.id}
                  className={styles.followupCard}
                  onClick={() => handleFollowupClick(record.id)}
                >
                  <View className={styles.cardHeader}>
                    <Image
                      className={styles.cardAvatar}
                      src={customer?.avatar || 'https://picsum.photos/id/64/200/200'}
                      mode="aspectFill"
                    />
                    <View className={styles.cardInfo}>
                      <Text className={styles.cardName}>{record.customerName}</Text>
                      <View className={styles.cardStage}>
                        <View className={classnames(styles.stageBadge, getStageClass(record.stage))}>
                          <Text>{record.stageLabel}</Text>
                        </View>
                      </View>
                    </View>
                    <View className={classnames(styles.cardStatus, getStatusClass(record.status))}>
                      <Text>{record.status}</Text>
                    </View>
                  </View>

                  <View className={styles.cardBody}>
                    {record.photos.length > 0 && (
                      <View className={styles.photoRow}>
                        {record.photos.slice(0, 3).map((photo, i) => (
                          <View key={i} className={styles.photoItem}>
                            <Image className={styles.photoImg} src={photo} mode="aspectFill" />
                          </View>
                        ))}
                      </View>
                    )}
                    
                    {record.feedback && (
                      <Text className={styles.feedbackPreview}>{record.feedback}</Text>
                    )}

                    {record.discomfortTags.length > 0 && (
                      <View className={styles.discomfortTags}>
                        {record.discomfortTags.map((tag, i) => (
                          <Text key={i} className={styles.discomfortTag}>{tag}</Text>
                        ))}
                      </View>
                    )}
                  </View>

                  <View className={styles.cardFooter}>
                    <View className={styles.footerInfo}>
                      <Text>治疗：{record.treatmentDate}</Text>
                      {record.rebookIntent !== '未提及' && (
                        <View className={styles.rebookTag}>
                          补针意向：{record.rebookIntent}
                        </View>
                      )}
                    </View>
                    <Text className={styles.viewDetail}>详情 →</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📭</Text>
              <Text className={styles.emptyText}>暂无回访记录</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FollowupPage;
