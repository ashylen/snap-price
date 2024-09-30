export const normalizePrice = (price: string | number) => {
  if (typeof price === "number") {
    return price;
  }

  const parsedPrice = parseFloat(price.replaceAll(/[^0-9,.]/g, "").replaceAll(",", "."));

  if (isNaN(parsedPrice)) {
    console.warn(`${price} is not a number!`);
  }

  return parsedPrice;
};
