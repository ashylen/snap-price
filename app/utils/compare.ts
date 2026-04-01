import { Product, ProductFormat } from "app/context/appContext";

export type Mismatch = {
  label: string;
  shelfPrice: number;
  receiptPrice: number;
  overcharge: number;
};

const normalizeLabel = (label: string): string =>
  label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

/** Match receipt items to shelf items by fuzzy label, return overcharged mismatches. */
export const compareProducts = (
  shelfProducts: Product[],
  receiptProducts: ProductFormat[]
): Mismatch[] => {
  if (!shelfProducts?.length || !receiptProducts?.length) return [];

  const mismatches: Mismatch[] = [];

  for (const receiptItem of receiptProducts) {
    if (!receiptItem.label) continue;

    const rLabel = normalizeLabel(receiptItem.label);
    const match = shelfProducts.find((p) => {
      if (!p.product?.label) return false;
      const sLabel = normalizeLabel(p.product.label);
      return sLabel.includes(rLabel) || rLabel.includes(sLabel);
    });

    if (!match) continue;

    const shelfPrice = Number(match.product.price);
    const receiptPrice = Number(receiptItem.price);

    if (!isNaN(shelfPrice) && !isNaN(receiptPrice) && receiptPrice !== shelfPrice) {
      mismatches.push({
        label: receiptItem.label,
        shelfPrice,
        receiptPrice,
        overcharge: Number((receiptPrice - shelfPrice).toFixed(2))
      });
    }
  }

  return mismatches;
};
