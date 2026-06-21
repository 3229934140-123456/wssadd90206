import React, { useState } from 'react';
import { View, Text, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { concernTags, worryTags, budgetRanges } from '@/data/mockData';
import { useAppStore } from '@/store';
import { MarkedArea } from '@/types';
import TagSelector from '@/components/TagSelector';
import FaceMap from '@/components/FaceMap';
import SectionTitle from '@/components/SectionTitle';
import styles from './index.module.scss';

const DemandDetailPage: React.FC = () => {
  const router = useRouter();
  const recordId = router.params.id;
  const customerId = router.params.customerId || 'c001';
  const isNew = !recordId;

  const { customers, demandRecords, addDemandRecord, updateDemandRecord } = useAppStore();

  const existingRecord = demandRecords.find(d => d.id === recordId);
  const customer = customers.find(c => c.id === customerId) || customers[0];

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
  const [markedAreas, setMarkedAreas] = useState<MarkedArea[]>(
    existingRecord?.markedAreas || []
  );

  const colors = ['#FF4D4F', '#1890FF', '#52C41A', '#FAAD14', '#722ED1'];

  const getAreaLabel = (): string => {
    if (selectedConcerns.length > 0) {
      return selectedConcerns[selectedConcerns.length - 1];
    }
    return '关注区域';
  };

  const handleAddMark = (x: number, y: number) => {
    const label = getAreaLabel();
    const newArea: MarkedArea = {
      id: `m${Date.now()}`,
      x,
      y,
      radius: 10,
      color: selectedColor,
      label
    };
    setMarkedAreas(prev => [...prev, newArea]);
    
    if (!selectedConcerns.includes(label) && label !== '关注区域') {
      setSelectedConcerns(prev => [...prev, label]);
    }
  };

  const handleRemoveMark = (id: string) => {
    setMarkedAreas(prev => prev.filter(a => a.id !== id));
  };

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

  const validateForm = (): boolean => {
    if (selectedConcerns.length === 0) {
      Taro.showToast({ title: '请选择改善部位', icon: 'none' });
      return false;
    }
    if (!selectedBudget) {
      Taro.showToast({ title: '请选择预算范围', icon: 'none' });
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const recordData = {
      customerId: customer.id,
      customerName: customer.name,
      concernTags: selectedConcerns,
      worryTags: selectedWorries,
      budgetRange: selectedBudget,
      markedAreas: markedAreas,
      notes: notes
    };

    if (isNew) {
      addDemandRecord(recordData);
    } else if (existingRecord) {
      updateDemandRecord(existingRecord.id, recordData);
    }

    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleGeneratePlan = () => {
    if (!validateForm()) return;

    handleSave();
    
    setTimeout(() => {
      Taro.showModal({
        title: '已发送给医生',
        content: `已将 ${customer.name} 的诉求记录发送给医生面诊，确认后将生成治疗方案`,
        showCancel: false,
        confirmText: '好的'
      });
    }, 1500);
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
          <SectionTitle title="面部示意图" subTitle={isNew ? '点击图上位置添加标注' : '客户关注区域'} />
          <View className={styles.card}>
            <View className={styles.faceMapContainer}>
              <FaceMap
                markedAreas={markedAreas}
                showLabels={true}
                interactive={isNew}
                currentColor={selectedColor}
                onAddMark={handleAddMark}
                onRemoveMark={handleRemoveMark}
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
            
            {isNew && (
              <Text className={styles.tipText}>
                💡 提示：先选择颜色和改善部位，再点击面部示意图添加标注
              </Text>
            )}
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
