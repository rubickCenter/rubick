import { ipcRenderer } from 'electron';

const useDrag = () => {
  let animationId: number;
  let mouseX: number;
  let mouseY: number;
  let draggable = true;

  const onMouseDown = (e) => {
    draggable = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.addEventListener('mouseup', onMouseUp);
    animationId = requestAnimationFrame(moveWindow);
  };

  const onMouseUp = () => {
    draggable = false;
    document.removeEventListener('mouseup', onMouseUp);
    cancelAnimationFrame(animationId);
  };

  const moveWindow = () => {
    ipcRenderer.send('msg-trigger', {
      type: 'windowMoving',
      data: { mouseX, mouseY },
    });
    if (draggable) animationId = requestAnimationFrame(moveWindow);
  };

  return {
    onMouseDown,
  };
};

export default useDrag;
