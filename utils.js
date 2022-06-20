const debounce = function (func, delay = 1000) {
  let timeOutID;

  return function (...args) {
    if (timeOutID) {
      clearTimeout(timeOutID);
    }

    timeOutID = setTimeout(function () {
      func.apply(null, args);
    }, delay);
  };
};
