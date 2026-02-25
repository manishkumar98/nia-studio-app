export function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN')
}

export function formatPoints(delta) {
  if (delta > 0) {
    return `+${delta} pts`
  } else {
    return `${delta} pts`
  }
}
