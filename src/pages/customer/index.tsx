import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import CustomerCard from '@/components/CustomerCard';
import StatCard from '@/components/StatCard';
import SectionTitle from '@/components/SectionTitle';
import styles from './index.module.scss';

const CustomerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('全部');
  const [searchText, setSearchText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const { customers, addCustomer } = useAppStore();

  useDidShow(() => {
    setActiveTab('全部');
    setSearchText('');
    setRefreshKey(prev => prev + 1);
  });

  const tabs = ['全部', '待咨询', '咨询中', '待确认', '恢复中', '已完成'];

  const todayReminders = useMemo(() => 
    customers.filter(c => 
      c.status === '恢复中' || c.status === '待确认' || c.status === '待咨询'
    ),
    [customers, refreshKey]
  );

  const newCustomers = useMemo(() => 
    customers.filter(c => c.level === '新客'),
    [customers, refreshKey]
  );

  const filteredCustomers = useMemo(() => 
    customers.filter(customer => {
      const matchTab = activeTab === '全部' || customer.status === activeTab;
      const matchSearch = customer.name.includes(searchText) || customer.phone.includes(searchText);
      return matchTab && matchSearch;
    }),
    [customers, activeTab, searchText, refreshKey]
  );

  const handleImport = () => {
    Taro.showActionSheet({
      itemList: ['从系统预约导入', '从Excel导入', '手动录入预约'],
      success: (res) => {
        if (res.tapIndex === 0 || res.tapIndex === 1) {
          (Taro.showModal as any)({
            title: '导入预约客户',
            editable: true,
            placeholderText: '请输入客户姓名',
            success: (modalRes: any) => {
              if (modalRes.confirm && modalRes.content) {
                const name = modalRes.content.trim();
                if (name) {
                  const phone = `138****${Math.floor(1000 + Math.random() * 9000)}`;
                  addCustomer({
                    name,
                    phone,
                    age: 25 + Math.floor(Math.random() * 20),
                    avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/200`,
                    level: '新客',
                    tags: ['预约客户'],
                    concernAreas: [],
                    nextAppointment: new Date(Date.now() + 86400000).toISOString().split('T')[0]
                  });
                  Taro.showToast({ title: '导入成功', icon: 'success' });
                }
              }
            }
          });
        } else if (res.tapIndex === 2) {
          handleAddCustomer();
        }
      }
    });
  };

  const handleAddCustomer = useCallback(() => {
    (Taro.showModal as any)({
      title: '新增客户',
      editable: true,
      placeholderText: '请输入客户姓名',
      success: (nameRes: any) => {
        if (nameRes.confirm && nameRes.content) {
          const name = nameRes.content.trim();
          if (!name) return;
          
          (Taro.showModal as any)({
            title: '客户手机号',
            editable: true,
            placeholderText: '请输入客户手机号',
            success: (phoneRes: any) => {
              if (phoneRes.confirm && phoneRes.content) {
                const phone = phoneRes.content.trim();
                if (!/^1\d{10}$/.test(phone) && !/^1\d{4}\*\*\*\*\d{4}$/.test(phone)) {
                  Taro.showToast({ title: '请输入有效手机号', icon: 'none' });
                  return;
                }

                Taro.showActionSheet({
                  itemList: ['新客', '普通', 'VIP'],
                  success: (levelRes) => {
                    const levels: Array<'新客' | '普通' | 'VIP'> = ['新客', '普通', 'VIP'];
                    const level = levels[levelRes.tapIndex];
                    
                    addCustomer({
                      name,
                      phone,
                      age: 25 + Math.floor(Math.random() * 20),
                      avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/200`,
                      level,
                      tags: [],
                      concernAreas: []
                    });
                    
                    Taro.showToast({ title: '添加成功', icon: 'success' });
                  }
                });
              }
            }
          });
        }
      }
    });
  }, [addCustomer]);

  const stats = [
    { value: customers.length, label: '总客户', icon: '👥', color: 'primary' as const },
    { value: todayReminders.length, label: '今日跟进', icon: '📋', color: 'warning' as const },
    { value: newCustomers.length, label: '新客', icon: '✨', color: 'success' as const },
    { value: customers.filter(c => c.level === 'VIP').length, label: 'VIP', icon: '👑', color: 'secondary' as const }
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
            <SectionTitle title="今日跟进" subTitle={`共 ${todayReminders.length} 位需要跟进`} />
            {todayReminders.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
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
