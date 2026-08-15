/* ============================================================
   KAABE — Qaadista sawirada

   Kamarad ama gallery. Wuxuu soo celiyaa data-URI (base64) si isku mid ah
   labada nidaam:
     · native — expo-image-picker (si tartiib ah loo `require` gareeyo,
                maxaa yeelay web-ka wuu ka burburaa marka la soo dejiyo)
     · web    — <input type="file"> (`capture` ayaa kamaradda furaya)

   Habka maxalliga ah data-URI-gu tooska ayuu u kaydsan yahay. Habka
   Supabase, `remoteProvider` ayaa Storage u shubaya kadibna signed URL
   soo celinaya.
   ============================================================ */
import { Platform } from 'react-native';

const MAX_SIDE = 512;
const QUALITY = 0.6;

/* ---------- web ---------- */

function pickWeb(useCamera) {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve({ uri: null });
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (useCamera) input.capture = 'environment';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return resolve({ uri: null });
      const reader = new FileReader();
      reader.onload = () => resolve({ uri: shrinkWeb(reader.result) });
      reader.onerror = () => resolve({ uri: null, error: 'Sawirka lama akhrin karin.' });
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

/* Sawirada waaweyn AsyncStorage way buuxiyaan — cabbirka hoos u dhig */
function shrinkWeb(dataUri) {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') return resolve(dataUri);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', QUALITY));
    };
    img.onerror = () => resolve(dataUri);
    img.src = dataUri;
  });
}

/* ---------- native ---------- */

async function pickNative(useCamera) {
  let ImagePicker;
  try {
    // eslint-disable-next-line global-require
    ImagePicker = require('expo-image-picker');
  } catch (e) {
    return { uri: null, error: 'Qaadista sawirku ma diyaar aha.' };
  }

  const requestPermission = useCamera
    ? ImagePicker.requestCameraPermissionsAsync
    : ImagePicker.requestMediaLibraryPermissionsAsync;

  try {
    const permission = await requestPermission();
    if (permission?.status !== 'granted') {
      return { uri: null, error: 'Ogolaansho lama helin.' };
    }
  } catch (e) {
    return { uri: null, error: 'Ogolaansho lama helin.' };
  }

  const options = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: QUALITY,
    base64: true,
  };

  const result = useCamera
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync(options);

  if (result.canceled) return { uri: null };
  const asset = result.assets?.[0];
  if (!asset) return { uri: null };

  /* data-URI ayaa la doorbidayaa si labada habba isku mid u noqdaan */
  const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
  return { uri };
}

/* ---------- interface-ka guud ---------- */

export async function pickPhoto({ camera = false } = {}) {
  try {
    const result = Platform.OS === 'web' ? await pickWeb(camera) : await pickNative(camera);
    /* web-ku promise buu soo celiyaa `shrinkWeb` awgeed */
    const uri = result.uri instanceof Promise ? await result.uri : result.uri;
    return { ...result, uri };
  } catch (e) {
    return { uri: null, error: e.message || 'Sawirka lama qaadin.' };
  }
}
