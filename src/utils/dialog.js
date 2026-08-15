/* ============================================================
   KAABE — Digniinaha laba nidaamka

   `Alert.alert` oo badhamo leh WEB-ka kuma shaqeeyo: react-native-web
   wuxuu u beddelaa `window.alert`, kaasoo qoraalka keliya tusa —
   `onPress` waligiis ma dhaco. Taasi waxay ka dhigaysaa in tallaabooyinka
   xaqiijinta (ka bax, tirtir, ka saar) aysan web-ka waxba ka qaban.

   Halkan hal jid ayaa loo sameeyay: native → Alert, web → window.confirm.
   ============================================================ */
import { Alert, Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

/* Xaqiijin: `onConfirm` waxaa la waca marka qofku aqbalo */
export function confirm({
  title,
  message,
  confirmLabel = 'Haa',
  cancelLabel = 'Maya',
  destructive = false,
  onConfirm,
}) {
  if (isWeb) {
    const text = message ? `${title}\n\n${message}` : title;
    // eslint-disable-next-line no-alert
    if (typeof window !== 'undefined' && window.confirm(text)) onConfirm?.();
    return;
  }

  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    {
      text: confirmLabel,
      style: destructive ? 'destructive' : 'default',
      onPress: () => onConfirm?.(),
    },
  ]);
}

/* Warbixin fudud (khalad ama guul) */
export function notify(title, message) {
  if (isWeb) {
    // eslint-disable-next-line no-alert
    if (typeof window !== 'undefined') window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

/* Doorasho gaaban (tusaale: kamarad mise gallery). Web-ku hal jid ayuu
   leeyahay, sidaas si toos ah ayaa loo waca kan koowaad ee `fallback`. */
export function choose({ title, message, options = [], fallback }) {
  if (isWeb) {
    fallback?.();
    return;
  }
  Alert.alert(title, message, [
    ...options.map((o) => ({ text: o.label, onPress: o.onPress })),
    { text: 'Jooji', style: 'cancel' },
  ]);
}
