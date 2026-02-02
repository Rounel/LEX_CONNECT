import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type ThemedMainViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedMainView({ style, lightColor, darkColor, ...otherProps }: ThemedMainViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'mainBackground');

  return <View style={[{ backgroundColor }, themedMainViewStyle.mainView, style, style]} {...otherProps} />;
}

const themedMainViewStyle = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
    gap: 8,
    padding: 16,
  },
});