import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { TagItem } from '@/types';
import styles from './index.module.scss';

interface TagSelectorProps {
  tags: TagItem[];
  selectedTags: string[];
  onToggle: (tagLabel: string) => void;
  color?: 'pink' | 'purple' | 'blue' | 'green' | 'orange';
}

const TagSelector: React.FC<TagSelectorProps> = ({ tags, selectedTags, onToggle, color = 'pink' }) => {
  return (
    <View className={styles.tagContainer}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.label);
        return (
          <View
            key={tag.id}
            className={classnames(
              styles.tagItem,
              styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`],
              isSelected && styles.selected
            )}
            onClick={() => onToggle(tag.label)}
          >
            <Text className={styles.tagText}>{tag.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default TagSelector;
