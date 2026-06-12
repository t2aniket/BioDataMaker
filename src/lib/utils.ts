import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amountInPaise: number, currency: string = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amountInPaise / 100)
}

export function getLabel(fieldKey: string, dict: any, labelMode: string = "both"): string {
  if (!dict) return fieldKey;
  const enDict = dict._en || {};
  const englishVal = enDict[fieldKey] || dict[fieldKey];
  const nativeVal = dict[fieldKey] || fieldKey;

  if (labelMode === 'en') {
    return englishVal || nativeVal;
  }
  if (labelMode === 'native') {
    return nativeVal;
  }
  // both mode
  if (englishVal && nativeVal && englishVal !== nativeVal) {
    return `${englishVal} / ${nativeVal}`;
  }
  return nativeVal;
}
