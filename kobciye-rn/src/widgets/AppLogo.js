import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const LOGO_ASSET = require('../../assets/logo/kobciye-logo.png');

// Kobciye wordmark.
//
// Prefers the bundled logo artwork when it can be loaded and the surface
// is light enough for its dark-blue/gold colorway to read well. Falls back
// to a drawn wordmark — "Kobciye" with the brand's signature gold dot over
// the "i" — when the asset is missing, or when `light` is true (placed on
// a dark/gradient background, where the dark logo wouldn't read).
//
// `showTagline` is intentionally a no-op for the public Phase 1 build —
// the logo area shows only the "Kobciye" wordmark, no slogan underneath.
export default function AppLogo({ size = 40, light = false, showTagline = false }) {
  const [imageFailed, setImageFailed] = useState(false);

  const wordmark =
    light || imageFailed ? (
      <DrawnWordmark size={size} color={light ? Colors.white : Colors.primary} />
    ) : (
      <Image
        source={LOGO_ASSET}
        style={{ height: size * 1.05, width: size * 3.6 }}
        resizeMode="contain"
        onError={() => setImageFailed(true)}
      />
    );

  return (
    <View style={{ alignItems: 'flex-start' }}>
      {wordmark}
    </View>
  );
}

// Text-drawn fallback wordmark — "Kobciye" with a gold dot over the "i".
function DrawnWordmark({ size, color }) {
  const dotSize = size * 0.17;
  // Approximate horizontal position of the "i" within "Kobciye" at this
  // font size/weight — placed by eye to mirror the brand mark.
  const dotLeft = size * 2.34;

  return (
    <View style={{ width: size * 4.2, height: size * 1.25 }}>
      <Text style={[styles.wordmark, { fontSize: size, color, letterSpacing: -1.2 }]}>Kobciye</Text>
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            left: dotLeft,
            top: size * 0.02,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wordmark: { fontWeight: '800' },
  dot: { position: 'absolute', backgroundColor: Colors.accent },
});
