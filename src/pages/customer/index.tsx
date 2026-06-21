import React, { useState } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockCustomers } from '@/data/mockData';
import { Customer } from '@/types';
import CustomerCard from '@/components/CustomerCard';
import StatCard from '@/components/StatCard';
import SectionTitle from '@/components/SectionTitle';
import styles from './index.module.scss';

const CustomerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('全部');
  const [searchText, setSearchText] = useState('');

  const tabs = ['全部', '待咨询', '咨询中', '待确认', '恢复中', '已完成'];

  const todayReminders = mockCustomers.filter(c => c.status === '恢复中' || c.status === '待确认');
  const newCustomers = mockCustomers.filter(c => c.level === '新客');

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchTab = activeTab === '全部' || customer.status === activeTab;
    const matchSearch = customer.name.includes(searchText) || customer.phone.includes(searchText);
    return matchTab && matchSearch;
  });

  const handleImport = () => {
    Taro.showToast({ title: '导入预约客户功能', icon: 'none' });
  };

  const handleAddCustomer = () => {
    Taro.showToast({ title: '新增客户功能', icon: 'none' });
  };

  const stats = [
    { value: mockCustomers.length, label: '总客户', icon: '👥', color: 'primary' as const },
    { value: todayReminders.length, label: '今日跟进', icon: '📋', color: 'warning' as const },
    { value: newCustomers.length, label: '新客', icon: '✨', color: 'success' as const },
    { value: mockCustomers.filter(c => c.level === 'VIP').length, label: 'VIP', icon: '👑', color: 'secondary' as const }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.greeting}>早上好，小美</Text>
        <Text className={styles.subGreeting}>今天有 {todayReminders.length} 位客户需要跟进哦~</Text>
        
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索客户姓名/手机号"
            placeholderClass={styles.searchInput}
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>

        <View className={styles.quickActions}>
          <View className={styles.actionBtn} onClick={handleImport}>
            <Text className={styles.actionIcon}>📥</Text>
            <Text className={styles.actionText}>导入预约</Text>
          </View>
          <View className={styles.actionBtn} onClick={handleAddCustomer}>
            <Text className={styles.actionIcon}>➕</Text>
            <Text className={styles.actionText}>新增客户</Text>
          </View>
          <View className={styles.actionBtn}>
            <Text className={styles.actionIcon}>⏰</Text>
            <Text className={styles.actionText}>到店提醒</Text>
          </View>
        </View>
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

        {todayReminders.length > 0 && (
          <View className={styles.section}>
            <SectionTitle title="今日跟进" subTitle="优先处理以下客户" />
            <View className={styles.reminderCard} onClick={() => {
              Taro.navigateTo({ url: `/pages/customer-detail/index?id=${todayReminders[0].id}` });
            }}>
              <Text className={styles.reminderIcon}>⏰</Text>
              <View className={styles.reminderContent}>
                <Text className={styles.reminderTitle}>
                  {todayReminders[0].name} · {todayReminders[0].status}
                </Text>
                <Text className={styles.reminderDesc}>
                  {todayReminders[0].tags.slice(0, 3).join(' · ')}
                </Text>
              </View>
              <Text className={styles.reminderDesc}>查看 →</Text>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <SectionTitle title="客户列表" extra={`共 ${filteredCustomers.length} 位`} />
          
          <ScrollView scrollX className={styles.tabRow}>
            {tabs.map((tab) => (
              <View
                key={tab}
                className={classnames(styles.tabItem, activeTab === tab && styles.active)}
                onClick={() => setActiveTab(tab)}
              >
                <Text>{tab}</Text>
              </View>
            ))}
          </ScrollView>

          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📭</Text>
              <Text className={styles.emptyText}>暂无相关客户</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomerPage;
