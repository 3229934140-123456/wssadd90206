import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatCardProps {
  value: string | number;
  label: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, color = 'primary', icon }) => {
  return (
    <View className={classnames(styles.statCard, styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`])}>
      <View className={styles.icon}>{icon}</View>
      <View className={styles.value}>{value}</View>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatCard;
