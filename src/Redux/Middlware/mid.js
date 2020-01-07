const mid = store => next => action => {
  next(action);
};
export default mid;
