import { keyPressed } from "kontra";

export default (key, cb = () => {}) => {
  let pushed = false;

  return props => {
    if (!pushed && keyPressed(key)) {
      cb(props);
      pushed = true;
    } else if (pushed && !keyPressed("e")) {
      pushed = false;
    }
  };
};
