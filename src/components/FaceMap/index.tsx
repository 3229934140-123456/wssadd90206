import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { MarkedArea, InjectionPoint } from '@/types';
import styles from './index.module.scss';

interface FaceMapProps {
  markedAreas?: MarkedArea[];
  injectionPoints?: InjectionPoint[];
  showLabels?: boolean;
  type?: 'concern' | 'injection';
  interactive?: boolean;
  currentColor?: string;
  onAddMark?: (x: number, y: number) => void;
  onRemoveMark?: (id: string) => void;
}

const FaceMap: React.FC<FaceMapProps> = ({
  markedAreas = [],
  injectionPoints = [],
  showLabels = true,
  interactive = false,
  onAddMark,
  onRemoveMark
}) => {
  const handleClick = (e: any) => {
    if (!interactive || !onAddMark) return;

    const query = Taro.createSelectorQuery();
    query.select(`.${interactive ? styles.faceOutlineInteractive : styles.faceOutline}`).boundingClientRect();
    query.exec((res) => {
      if (res && res[0]) {
        const rect = res[0];
        const x = ((e.detail.x - rect.left) / rect.width) * 100;
        const y = ((e.detail.y - rect.top) / rect.height) * 100;
        
        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
          onAddMark(Math.round(x), Math.round(y));
        }
      }
    });
  };

  const handleMarkClick = (e: any, id: string) => {
    e.stopPropagation();
    if (interactive && onRemoveMark) {
      Taro.showActionSheet({
        itemList: ['删除此标注'],
        success: (res) => {
          if (res.tapIndex === 0) {
            onRemoveMark(id);
          }
        }
      });
    }
  };

  return (
    <View className={styles.faceMapContainer}>
      <View 
        className={interactive ? styles.faceOutlineInteractive : styles.faceOutline}
        onClick={handleClick}
      >
        <View className={styles.faceShape} />
        
        <View className={styles.eyeLeft} />
        <View className={styles.eyeRight} />
        <View className={styles.eyebrowLeft} />
        <View className={styles.eyebrowRight} />
        
        <View className={styles.nose} />
        
        <View className={styles.lipUpper} />
        <View className={styles.lipLower} />
        
        <View className={styles.cheekLeft} />
        <View className={styles.cheekRight} />
        
        <View className={styles.chin} />
        <View className={styles.forehead} />
        
        {markedAreas.map((area) => (
          <View
            key={area.id}
            className={styles.markedCircle}
            style={{
              left: `${area.x}%`,
              top: `${area.y}%`,
              width: `${area.radius * 2}%`,
              height: `${area.radius * 2}%`,
              borderColor: area.color,
              backgroundColor: `${area.color}20`
            }}
            onClick={(e) => handleMarkClick(e, area.id)}
          >
            {showLabels && (
              <Text className={styles.areaLabel} style={{ color: area.color }}>
                {area.label}
              </Text>
            )}
          </View>
        ))}
        
        {injectionPoints.map((point) => (
          <View
            key={point.id}
            className={styles.injectionPoint}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`
            }}
          >
            <View className={styles.pointDot} />
            {showLabels && (
              <Text className={styles.pointLabel}>{point.name}</Text>
            )}
          </View>
        ))}
      </View>
      
      <View className={styles.faceLabels}>
        <Text className={styles.labelText}>正面面部示意图</Text>
      </View>
    </View>
  );
};

export default FaceMap;
