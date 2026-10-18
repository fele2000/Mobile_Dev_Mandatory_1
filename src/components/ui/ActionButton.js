import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function ActionButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) {
  const secondary = variant === 'secondary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.secondary : styles.primary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? COLORS.brand : '#FFFFFF'} />
      ) : (
        <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: COLORS.brand },
  secondary: { backgroundColor: COLORS.brandLight },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.82 },
  text: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryText: { color: COLORS.brandDark },
});
