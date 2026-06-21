import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionTitleProps {
  title: string;
  subTitle?: string;
  extra?: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subTitle, extra }) => {
  return (
    <View className={styles.sectionHeader}>
      <View className={styles.titleRow}>
        <View className={styles.titleBar} />
        <Text className={styles.title}>{title}</Text>
        {extra && <View className={styles.extra}>{extra}</View>}
      </View>
      {subTitle && <Text className={styles.subTitle}>{subTitle}</Text>}
    </View>
  );
};

export default SectionTitle;
