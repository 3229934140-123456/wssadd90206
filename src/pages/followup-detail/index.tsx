import React, { useState, useMemo } from 'react';
import { View, Text, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { followupScripts, discomfortTags } from '@/data/mockData';
import { useAppStore } from '@/store';
import TagSelector from '@/components/TagSelector';
import SectionTitle from '@/components/SectionTitle';
import styles from './index.module.scss';

const FollowupDetailPage: React.FC = () => {
  const router = useRouter();
  const recordId = router.params.id || 'f001';
  const customerId = router.params.customerId;

  const { customers, followupRecords, updateFollowupRecord, addPhotoToFollowup, completeFollowup } = useAppStore();

  const record = useMemo(() => 
    followupRecords.find(f => f.id === recordId) || followupRecords[0],
    [followupRecords, recordId]
  );
  
  const customer = useMemo(() => 
    customers.find(c => c.id === (customerId || record.customerId)) || customers[0],
    [customers, customerId, record]
  );

  const [feedback, setFeedback] = useState(record.feedback);
  const [selectedDiscomfort, setSelectedDiscomfort] = useState<string[]>(record.discomfortTags);
  const [rebookIntent, setRebookIntent] = useState<string>(record.rebookIntent);

  const stages = [
    { label: '术后第1天', key: 'day1' },
    { label: '术后第7天', key: 'day7' },
    { label: '术后第14天', key: 'day14' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === record.stage);

  const handleDiscomfortToggle = (tag: string) => {
    setSelectedDiscomfort(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleUploadPhoto = () => {
    Taro.chooseImage({
      count: 9 - record.photos.length,
      success: (res) => {
        const tempFiles = res.tempFiles || [];
        tempFiles.forEach(file => {
          addPhotoToFollowup(record.id, file.path || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/400/400`);
        });
        Taro.showToast({ title: '上传成功', icon: 'success' });
      },
      fail: () => {
        const mockPhoto = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/400/400`;
        addPhotoToFollowup(record.id, mockPhoto);
        Taro.showToast({ title: '上传成功', icon: 'success' });
      }
    });
  };

  const handleCopyScript = () => {
    const script = followupScripts.find(s => s.stage === record.stage);
    if (script) {
      Taro.setClipboardData({
        data: script.content,
        success: () => {
          Taro.showToast({ title: '已复制话术', icon: 'success' });
        }
      });
    }
  };

  const handleSendToDoctor = () => {
    Taro.showModal({
      title: '转给医生复核',
      content: '确认将该客户的不适反馈转给医生复核吗？',
      success: (res) => {
        if (res.confirm) {
          updateFollowupRecord(record.id, { needDoctorReview: true });
          Taro.showToast({ title: '已转给医生', icon: 'success' });
        }
      }
    });
  };

  const handleSave = () => {
    updateFollowupRecord(record.id, {
      feedback,
      discomfortTags: selectedDiscomfort,
      rebookIntent: rebookIntent as any,
      status: '进行中'
    });
    Taro.showToast({ title: '保存成功', icon: 'success' });
  };

  const handleComplete = () => {
    Taro.showModal({
      title: '完成回访',
      content: '确认完成本次回访吗？',
      success: (res) => {
        if (res.confirm) {
          updateFollowupRecord(record.id, {
            feedback,
            discomfortTags: selectedDiscomfort,
            rebookIntent: rebookIntent as any
          });
          completeFollowup(record.id);
          Taro.showToast({ title: '回访完成', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 1500);
        }
      }
    });
  };

  const currentScript = followupScripts.find(s => s.stage === record.stage);

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
              治疗日：{record.treatmentDate}
            </Text>
          </View>
          <View className={styles.stageBadge}>
            <Text>{record.stageLabel}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="回访进度" />
          <View className={styles.card}>
            <View className={styles.stagesTimeline}>
              {stages.map((stage, index) => {
                const isDone = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                return (
                  <View key={stage.key} className={styles.stageItem}>
                    {index < stages.length - 1 && (
                      <View className={classnames(
                        styles.stageLine,
                        isDone && styles.stageLineDone
                      )} />
                    )}
                    <View className={classnames(
                      styles.stageDot,
                      isDone && styles.stageDotActive,
                      isCurrent && styles.stageDotCurrent
                    )}>
                      {isDone ? '✓' : index + 1}
                    </View>
                    <Text className={classnames(
                      styles.stageLabel,
                      isDone && styles.stageLabelActive
                    )}>
                      {stage.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {currentScript && (
          <View className={styles.section}>
            <SectionTitle title="回访话术参考" />
            <View className={styles.scriptCard}>
              <View className={styles.scriptHeader}>
                <Text className={styles.scriptTitle}>💬 {currentScript.title}</Text>
                <View className={styles.scriptCopy} onClick={handleCopyScript}>
                  <Text>复制</Text>
                </View>
              </View>
              <Text className={styles.scriptContent}>{currentScript.content}</Text>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <SectionTitle title="术后照片" subTitle="客户上传的恢复照片" />
          <View className={styles.card}>
            <View className={styles.photoGrid}>
              {record.photos.map((photo, index) => (
                <View key={index} className={styles.photoItem}>
                  <Image className={styles.photoImg} src={photo} mode="aspectFill" />
                </View>
              ))}
              <View className={styles.photoAdd} onClick={handleUploadPhoto}>
                <Text className={styles.photoAddIcon}>📷</Text>
                <Text className={styles.photoAddText}>上传照片</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="不适反馈" subTitle="勾选客户反映的不适症状" />
          <View className={styles.card}>
            <TagSelector
              tags={discomfortTags}
              selectedTags={selectedDiscomfort}
              onToggle={handleDiscomfortToggle}
              color="pink"
            />
            
            <View className={styles.feedbackSection}>
              <Text className={styles.discomfortTitle}>
                <Text className={styles.discomfortIcon}>📝</Text>
                详细反馈
              </Text>
              <Textarea
                className={styles.feedbackInput}
                placeholder="记录客户的详细反馈..."
                value={feedback}
                onInput={(e) => setFeedback(e.detail.value)}
                maxlength={500}
              />
            </View>

            {selectedDiscomfort.length > 0 && (
              <View className={styles.doctorReviewBanner}>
                <Text className={styles.doctorReviewIcon}>⚠️</Text>
                <Text className={styles.doctorReviewText}>
                  客户有 {selectedDiscomfort.length} 项不适，建议转给医生复核
                </Text>
                <View className={styles.doctorReviewBtn} onClick={handleSendToDoctor}>
                  <Text>转医生</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="补针意向" />
          <View className={styles.card}>
            <View className={styles.rebookOptions}>
              {['高', '中', '低', '未提及'].map(level => (
                <View
                  key={level}
                  className={classnames(
                    styles.rebookItem,
                    rebookIntent === level && styles.active
                  )}
                  onClick={() => setRebookIntent(level)}
                >
                  <Text>{level}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={handleSave}>
          <Text className={styles.btnSecondaryText}>保存</Text>
        </View>
        <View className={styles.btnPrimary} onClick={handleComplete}>
          <Text className={styles.btnText}>完成本次回访</Text>
        </View>
      </View>
    </View>
  );
};

export default FollowupDetailPage;
