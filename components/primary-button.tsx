import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined' | 'text';
  disabled?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({
  title,
  onPress,
  variant = 'filled',
  disabled = false,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'filled' && styles.filled,
        variant === 'outlined' && styles.outlined,
        variant === 'text' && styles.text,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <ThemedText
        style={[
          styles.label,
          variant === 'filled' && styles.filledLabel,
          variant === 'outlined' && styles.outlinedLabel,
          variant === 'text' && styles.textLabel,
          disabled && styles.disabledLabel,
        ]}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: Palette.primary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Palette.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  filledLabel: {
    color: '#FFFFFF',
  },
  outlinedLabel: {
    color: Palette.primary,
  },
  textLabel: {
    color: Palette.primary,
  },
  disabledLabel: {
    color: Palette.accent2,
  },
});
