import EtchASketch from './game';

$(() => {
  const canvas = $('.etch-space')[0];
  new EtchASketch(canvas);
});

// $(window).on('load', function () {
//   // your code here
//   const canvas = $('.etch-space')[0];
//   new EtchASketch(canvas);
// });