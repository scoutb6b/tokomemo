"use client";

const productNames = new Map<string, string>();

export function rememberProductName(id: string, name: string) {
  if (!id || !name) return;
  productNames.set(id, name);
}

export function rememberedProductName(id: string) {
  return productNames.get(id);
}
