import { screen } from 'electron';

const winPosition = {
  x: 0,
  y: 0,
  id: -1,
  getPosition(): { x: number; y: number } {
    const { x, y } = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint({ x, y });
    if (winPosition.id !== currentDisplay.id) {
      winPosition.id = currentDisplay.id;
      winPosition.x = parseInt(
        String(
          currentDisplay.workArea.x + currentDisplay.workArea.width / 2 - 400
        )
      );
      winPosition.y = parseInt(
        String(
          currentDisplay.workArea.y + currentDisplay.workArea.height / 2 - 200
        )
      );
    }
    return {
      x: winPosition.x,
      y: winPosition.y,
    };
  },
  setPosition(x: number, y: number): void {
    winPosition.x = x;
    winPosition.y = y;
  },
};

export default winPosition;
