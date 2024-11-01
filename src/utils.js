export const Colors = {
  RED: '#FF0000',
  GREEN: '#00FF00',
  BLUE: '#0000FF',
  YELLOW: '#FFFF00',
  PURPLE: '#FF00FF'
};

export function getRandomColor() {
  const colors = Object.values(Colors);
  return colors[Math.floor(Math.random() * colors.length)];
}

export function createTile(x, y) {
  return {
    color: getRandomColor(),
    x,
    y,
    matched: false
  };
}