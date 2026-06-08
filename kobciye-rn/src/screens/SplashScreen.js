import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '../constants/colors';
import AppLogo from '../widgets/AppLogo';

// Branded splash / boot screen — Kobciye logo on a gradient background.
// The logo itself doubles as the loading indicator: it breathes (scales +
// glows) in a soft pulsing loop while the app initializes, so nothing else
// needs to spin.
export default function SplashScreen({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.86)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 900, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => navigation.replace('Onboarding'), 1700);
    return () => clearTimeout(timer);
  }, []);

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.06] });
  const glow = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <LinearGradient colors={Gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <Animated.View style={{ opacity: fade, transform: [{ scale }], alignItems: 'center' }}>
        <Animated.View style={{ opacity: glow, transform: [{ scale: pulseScale }] }}>
          <AppLogo size={40} light />
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
