export function vibrateTap() {
  try {
    navigator.vibrate?.(10);
  } catch {
    // haptics are a nice-to-have, never block the interaction
  }
}

export function vibrateDone() {
  try {
    navigator.vibrate?.([12, 40, 18]);
  } catch {
    // haptics are a nice-to-have, never block the interaction
  }
}
