export const normalizePrice = (price: string | number): number => {
  if (typeof price === "number") {
    return price;
  }

  const cleanedPrice = price.replace(/[^0-9,.]/g, "").replace(",", ".");
  const parsedPrice = Number(cleanedPrice);

  if (isNaN(parsedPrice)) {
    console.warn(`${price} is not a number!`);
    return 0; // Default value for invalid inputs
  }

  return parsedPrice;
};
