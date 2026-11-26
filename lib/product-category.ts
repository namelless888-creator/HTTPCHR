// Category lookup is kept separate from the product data so the portable HTML
// export can read it without resolving the '@/lib/catalog' alias.
const cones = [2, 4, 6, 7, 9, 18, 19, 20, 44, 45, 46, 49];
const fruitIce = [3, 10, 13, 14, 28, 36, 50, 51, 52, 53];
const family = [16, 17, 32, 33, 34, 35, 56];

export const productCategory = (n: number) => cones.includes(n) ? 'Рожки'
  : fruitIce.includes(n) ? 'Фруктовый лёд'
  : family.includes(n) ? 'Для семьи'
  : [23, 24, 25, 37, 41, 42, 43].includes(n) ? 'Стаканчики' : 'Эскимо';
