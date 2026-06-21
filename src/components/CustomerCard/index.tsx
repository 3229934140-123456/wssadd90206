import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Customer } from '@/types';
import styles from './index.module.scss';

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
  showTags?: boolean;
}

const statusColors: Record<string, string> = {
  '待咨询': 'statusPending',
  '咨询中': 'statusConsulting',
  '待确认': 'statusConfirm',
  '治疗中': 'statusTreating',
  '恢复中': 'statusRecovering',
  '已完成': 'statusDone'
};

const levelColors: Record<string, string> = {
  'VIP': 'levelVip',
  '普通': 'levelNormal',
  '新客': 'levelNew'
};

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick, showTags = true }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/customer-detail/index?id=${customer.id}`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Image
          className={styles.avatar}
          src={customer.avatar}
          mode="aspectFill"
        />
        <View className={styles.info}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{customer.name}</Text>
            <View className={classnames(styles.level, styles[levelColors[customer.level]])}>
              <Text className={styles.levelText}>{customer.level}</Text>
            </View>
            <View className={classnames(styles.status, styles[statusColors[customer.status]])}>
              <Text className={styles.statusText}>{customer.status}</Text>
            </View>
          </View>
          <Text className={styles.phone}>{customer.phone} · {customer.age}岁</Text>
        </View>
      </View>

      {showTags && customer.tags.length > 0 && (
        <View className={styles.tags}>
          {customer.tags.slice(0, 4).map((tag, index) => (
            <View key={index} className={styles.tag}>
              <Text className={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.footer}>
        <Text className={styles.footerText}>上次到店：{customer.lastVisit}</Text>
        {customer.nextAppointment && (
          <Text className={styles.nextVisit}>下次：{customer.nextAppointment}</Text>
        )}
      </View>
    </View>
  );
};

export default CustomerCard;
