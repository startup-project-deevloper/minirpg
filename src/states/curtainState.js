export default ({ id, ctx, direction = 1, onFadeComplete = () => {} }) => {
  // https://stackoverflow.com/questions/19258169/fadein-fadeout-in-html5-canvas
  let isComplete = false;
  let alpha = direction < 0 ? 1 : 0,
    delta = 0.05;

  //ctx.globalAlpha = direction < 0 ? 1 : 0;

  // Under heavy testing
  const curtainEl = document.getElementById("curtain");
  curtainEl.style.opacity = direction < 0 ? 1 : 0;

  return {
    id,
    isComplete: () => isComplete,
    enter: props => {},
    update: () => {
      isComplete =
        (direction > 0 && alpha >= 1) || (direction < 0 && alpha <= -1);

      alpha = direction < 0 ? alpha - delta : alpha + delta;

      //ctx.clearRect(0, 0, ctx.width, ctx.height);
      //ctx.globalAlpha = isComplete ? Math.round(alpha) : alpha;

      curtainEl.style.opacity = isComplete ? Math.round(alpha) : alpha;
    },
    exit: () => {
      //ctx.globalAlpha = direction < 0 ? 0 : 1;
      curtainEl.style.opacity = direction < 0 ? 0 : 1;

      if (direction === 0) {
        curtainEl.remove();
      }

      onFadeComplete();
    }
  };
};
