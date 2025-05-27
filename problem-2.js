const unitInMG = {
  tons: 1000000000,
  kilograms: 1000000,
  grams: 1000,
  milligrams: 1,
};

// Convert unit object to milligrams
function toMilligrams(units) {
  let totalMg = 0;
  for (const key in units) {
    totalMg += units[key] * unitInMG[key];
  }
  return totalMg;
}

// Convert milligrams to normalized unit format
function fromMilligrams(totalMg) {
  const result = {};
  result.tons = Math.floor(totalMg / unitInMG.tons);
  totalMg %= unitInMG.tons;

  result.kilograms = Math.floor(totalMg / unitInMG.kilograms);
  totalMg %= unitInMG.kilograms;

  result.grams = Math.floor(totalMg / unitInMG.grams);
  totalMg %= unitInMG.grams;

  result.milligrams = totalMg;

  return result;
}

// Main stock update function
function update_stock(currentStock, change, operation) {
  let currentMg = toMilligrams(currentStock);
  let changeMg = toMilligrams(change);

  if (operation === 'sell') {
    currentMg -= changeMg;
    if (currentMg < 0) throw new Error("Not enough stock to sell!");
  } else if (operation === 'purchase') {
    currentMg += changeMg;
  } else {
    throw new Error("Invalid operation. Use 'sell' or 'purchase'.");
  }

  return fromMilligrams(currentMg);
}

// Example
const initial_stock = { tons: 1, kilograms: 0, grams: 0, milligrams: 0 };

const after_sale = update_stock(initial_stock, { tons: 0, kilograms: 0, grams: 1, milligrams: 0 }, "sell");
console.log(after_sale); 
// Output: { tons: 0, kilograms: 999, grams: 999, milligrams: 0 }

const after_purchase = update_stock(after_sale, { tons: 0, kilograms: 0, grams: 1001, milligrams: 0 }, "purchase");
console.log(after_purchase); 
// Output: { tons: 1, kilograms: 0, grams: 1, milligrams: 0 }
