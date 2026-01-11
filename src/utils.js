// get rotation of the lockpick, with the center of the lock as the origin point
export const getAngle = (x, y, xCenter, yCenter) => {
  const res =
    -(x - xCenter) / Math.sqrt((x - xCenter) ** 2 + (y - yCenter) ** 2);
  const rad = Math.acos(res);

  const deg = (rad * 180) / Math.PI;
  return deg;
};

// convert current mouse position into the lockpick rotation angle relative to the center of the lock
export const getLockPickAngle = (e, element) => {
  const x = e.clientX;
  const y = e.clientY;
  const xCenter =
    element.getBoundingClientRect().left + element.scrollWidth / 2;
  const yCenter =
    element.getBoundingClientRect().top + element.scrollHeight / 2;
  const angle = Math.max(0, Math.min(180, getAngle(x, y, xCenter, yCenter)));
  return angle;
};

export const getInvertedPoint = (x, y, xCenter, yCenter) => {
  const x2 = -(x - xCenter);
  const y2 = -(y - yCenter);
  return { x: x2, y: y2 };
};

export const getInvertedXY = (e, element) => {
  const x = e.clientX;
  const y = e.clientY;
  const xCenter =
    element.getBoundingClientRect().left + element.scrollWidth / 2;
  const yCenter =
    element.getBoundingClientRect().top + element.scrollHeight / 2;
  return getInvertedPoint(x, y, xCenter, yCenter);
};

export const generateSweetSpot = () => {
  return Math.min(170, Math.max((Math.random() * 1000) % 180, 10));
};
