/**
 * Expand Vue prototype with usefull features
 * @param {Object} Vue
 */

export default function (Vue) {
  Vue.prototype.$createNewDate = (settings = {}) => {
    const date = settings.existing ? new Date(settings.existing) : new Date();
    if (settings.month) {
      date.setMonth(date.getMonth() + settings.month);
    }
    const month = date.getMonth() + 1;
    return `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    }`;
  };
}
