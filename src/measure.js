let measure = {};

function startMeasure(index) {
  if (!(index in measure)) {
    measure[index] = {
      'start': 0,
      'end'  : 0,
      'total': 0,
    };
  }
  measure[index].start = performance.now();
}

function stopMeasure(index) {
  measure[index].end = performance.now();
  measure[index].total += measure[index].end - measure[index].start;
}
