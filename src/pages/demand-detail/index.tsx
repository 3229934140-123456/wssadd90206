import React, { useState } from 'react';
import { View, Text, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { mockCustomers, mockDemandRecords, concernTags, worryTags, budgetRanges } from '@/data/mockData';
import TagSelector from '@/components/TagSelector';
import FaceMap from '@/components/FaceMap';
import SectionTitle from '@/components/SectionTitle';
import styles from './index.module.scss';

const DemandDetailPage: React.FC = () => {
  const router = useRouter();
  const recordId = router.params.id;
  const customerId = router.params.customerId || 'c001';

  const existingRecord = mockDemandRecords.find(d => d.id === recordId);
  const customer = mockCustomers.find(c => c.id === customerId) || mockCustomers[0];

  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(
    existingRecord?.concernTags || []
  );
  const [selectedWorries, setSelectedWorries] = useState<string[]>(
    existingRecord?.worryTags || []
  );
  const [selectedBudget, setSelectedBudget] = useState<string>(
    existingRecord?.budgetRange || ''
  );
  const [notes, setNotes] = useState<string>(existingRecord?.notes || '');
  const [selectedColor, setSelectedColor] = useState<string>('#FF4D4F');

  const colors = ['#FF4D4F', '#1890FF', '#52C41A', '#FAAD14', '#722ED1'];

  const handleConcernToggle = (tag: string) => {
    setSelectedConcerns(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleWorryToggle = (tag: string) => {
    setSelectedWorries(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleGeneratePlan = () => {
    Taro.showToast({
      title: '已发送给医生',
      icon: 'success'
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.customerBar}>
          <Image
            className={styles.customerAvatar}
            src={customer.avatar}
            mode="aspectFill"
          />
          <View className={styles.customerInfo}>
            <Text className={styles.customerName}>{customer.name}</Text>
            <Text className={styles.customerMeta}>
              {customer.phone} · {customer.age}岁
            </Text>
          </View>
          <Text className={styles.customerMeta}>{customer.level}</Text>
        </View>

        <View className={styles.section}>
          <SectionTitle title="面部示意图" subTitle="用不同颜色圈出客户关注区域" />
          <View className={styles.card}>
            <View className={styles.faceMapContainer}>
              <FaceMap
                markedAreas={existingRecord?.markedAreas || []}
                showLabels={true}
              />
            </View>
            
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🎨</Text>
              选择标注颜色
            </Text>
            <View className={styles.colorPicker}>
              {colors.map(color => (
                <View
                  key={color}
                  className={classnames(styles.colorItem, selectedColor === color && styles.active)}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="改善部位" subTitle="客户想改善的部位" />
          <View className={styles.card}>
            <TagSelector
              tags={concernTags}
              selectedTags={selectedConcerns}
              onToggle={handleConcernToggle}
              color="purple"
            />
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="客户顾虑" subTitle="客户担心的问题" />
          <View className={styles.card}>
            <TagSelector
              tags={worryTags}
              selectedTags={selectedWorries}
              onToggle={handleWorryToggle}
              color="orange"
            />
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="预算范围" />
          <View className={styles.card}>
            <View className={styles.budgetList}>
              {budgetRanges.map(budget => (
                <View
                  key={budget}
                  className={classnames(styles.budgetItem, selectedBudget === budget && styles.active)}
                  onClick={() => setSelectedBudget(budget)}
                >
                  <Text>{budget}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="补充说明" />
          <View className={styles.card}>
            <Textarea
              className={styles.notesInput}
              placeholder="记录客户的其他需求、注意事项等..."
              value={notes}
              onInput={(e) => setNotes(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={handleSave}>
          <Text className={styles.btnSecondaryText}>保存记录</Text>
        </View>
        <View className={styles.btnPrimary} onClick={handleGeneratePlan}>
          <Text className={styles.btnText}>发给医生面诊</Text>
        </View>
      </View>
    </View>
  );
};

export default DemandDetailPage;
