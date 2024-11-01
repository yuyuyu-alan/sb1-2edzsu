export const Colors = {
  RED: '#FF4B4B',
  GREEN: '#4CAF50',
  BLUE: '#2196F3',
  YELLOW: '#FFC107',
  PURPLE: '#9C27B0'
}

export function getRandomColor() {
  const colors = Object.values(Colors)
  return colors[Math.floor(Math.random() * colors.length)]
}

export function createTile(x, y) {
  return {
    color: getRandomColor(),
    x,
    y,
    matched: false
  }
}