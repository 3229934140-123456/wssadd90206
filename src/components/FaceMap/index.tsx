import React from 'react';
import { View, Text } from '@tarojs/components';
import { MarkedArea, InjectionPoint } from '@/types';
import styles from './index.module.scss';

interface FaceMapProps {
  markedAreas?: MarkedArea[];
  injectionPoints?: InjectionPoint[];
  showLabels?: boolean;
  type?: 'concern' | 'injection';
}

const FaceMap: React.FC<FaceMapProps> = ({
  markedAreas = [],
  injectionPoints = [],
  showLabels = true,
  type = 'concern'
}) => {
  return (
    <View className={styles.faceMapContainer}>
      <View className={styles.faceOutline}>
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
