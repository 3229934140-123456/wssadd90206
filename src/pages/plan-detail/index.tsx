import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { contraindicationTags } from '@/data/mockData';
import { useAppStore } from '@/store';
import FaceMap from '@/components/FaceMap';
import SectionTitle from '@/components/SectionTitle';
import styles from './index.module.scss';

const PlanDetailPage: React.FC = () => {
  const router = useRouter();
  const planId = router.params.id || 'p001';
  const customerId = router.params.customerId;

  const { customers, treatmentPlans, confirmTreatmentPlan, updateTreatmentPlan } = useAppStore();

  const plan = useMemo(() => 
    treatmentPlans.find(p => p.id === planId) || treatmentPlans[0],
    [treatmentPlans, planId]
  );
  
  const customer = useMemo(() => 
    customers.find(c => c.id === (customerId || plan.customerId)) || customers[0],
    [customers, customerId, plan]
  );

  const [checkedContra, setCheckedContra] = useState<string[]>(plan.contraindications || []);

  useEffect(() => {
    if (plan.contraindications) {
      setCheckedContra(plan.contraindications);
    }
  }, [plan.id, plan.contraindications]);

  const toggleContra = (label: string) => {
    setCheckedContra(prev => {
      const next = prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label];
      updateTreatmentPlan(plan.id, { contraindications: next });
      return next;
    });
  };

  const handleConfirm = () => {
    Taro.showModal({
      title: '客户确认',
      content: '请让客户在手机上确认已了解治疗方案、剂量和注意事项',
      confirmText: '已确认',
      cancelText: '稍后确认',
      success: (res) => {
        if (res.confirm) {
          confirmTreatmentPlan(plan.id);
          Taro.showToast({
            title: '确认成功',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleStartTreatment = () => {
    Taro.showModal({
      title: '开始治疗',
      content: '确认开始治疗吗？治疗完成后将进入术后回访阶段',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '开始治疗流程',
            icon: 'success'
          });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  const totalPrice = plan.injectionPoints.reduce((sum, p) => sum + p.price, 0);

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
              {plan.date} · 注射方案
            </Text>
          </View>
          <View className={styles.doctorBadge}>
            <Text>👨‍⚕️ {plan.doctor}</Text>
          </View>
        </View>

        {plan.status === '已确认' ? (
          <View className={classnames(styles.statusBanner, styles.statusConfirmed)}>
            <Text className={styles.statusText}>✅ 客户已确认 · {plan.confirmedAt}</Text>
          </View>
        ) : (
          <View className={classnames(styles.statusBanner, styles.statusPending)}>
            <Text className={styles.statusText}>⏳ 待客户确认</Text>
          </View>
        )}

        <View className={styles.section}>
          <SectionTitle title="注射点位示意图" subTitle="医生确认的点位方案" />
          <View className={styles.card}>
            <View className={styles.faceMapContainer}>
              <FaceMap
                injectionPoints={plan.injectionPoints}
                showLabels={true}
              />
            </View>

            <View className={styles.summaryRow}>
              <View className={styles.summaryItem}>
                <Text className={styles.summaryValue}>{plan.injectionPoints.length}</Text>
                <Text className={styles.summaryLabel}>点位数量</Text>
              </View>
              <View className={styles.summaryItem}>
                <Text className={styles.summaryValue}>{plan.totalDosage}</Text>
                <Text className={styles.summaryLabel}>总剂量</Text>
              </View>
              <View className={styles.summaryItem}>
                <Text className={styles.summaryValue}>¥{totalPrice.toLocaleString()}</Text>
                <Text className={styles.summaryLabel}>预估费用</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="点位明细" subTitle="医生制定，不可修改剂量" />
          <View className={styles.card}>
            <View className={styles.pointsList}>
              {plan.injectionPoints.map((point) => (
                <View key={point.id} className={styles.pointItem}>
                  <View className={styles.pointIcon} />
                  <View className={styles.pointInfo}>
                    <Text className={styles.pointName}>{point.name}</Text>
                    <Text className={styles.pointProduct}>{point.product}</Text>
                  </View>
                  <Text className={styles.pointDosage}>{point.dosage}</Text>
                  <Text className={styles.pointPrice}>¥{point.price}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="治疗前禁忌" subTitle="请与客户确认勾选" />
          <View className={styles.card}>
            <View className={styles.contraList}>
              {contraindicationTags.map(tag => (
                <View
                  key={tag.id}
                  className={classnames(
                    styles.contraItem,
                    checkedContra.includes(tag.label) && styles.checked
                  )}
                  onClick={() => toggleContra(tag.label)}
                >
                  <Text className={styles.contraCheck}>
                    {checkedContra.includes(tag.label) ? '✓' : '○'}
                  </Text>
                  <Text>{tag.label}</Text>
                </View>
              ))}
            </View>

            {checkedContra.length > 0 && (
              <View className={styles.warningBox}>
                <Text className={styles.warningText}>
                  ⚠️ 客户存在 {checkedContra.length} 项禁忌情况，请医生评估是否适合治疗
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <SectionTitle title="知情同意" />
          <View className={styles.card}>
            <Text className={styles.warningText}>
              本人已了解上述治疗方案、注射点位、使用产品及剂量，知晓可能的风险和并发症，
              同意接受治疗并愿意配合术后随访。
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={() => Taro.navigateBack()}>
          <Text className={styles.btnSecondaryText}>返回</Text>
        </View>
        {plan.status === '已确认' ? (
          <View className={styles.btnPrimary} onClick={handleStartTreatment}>
            <Text className={styles.btnText}>开始治疗</Text>
          </View>
        ) : (
          <View className={styles.btnPrimary} onClick={handleConfirm}>
            <Text className={styles.btnText}>客户确认</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PlanDetailPage;
