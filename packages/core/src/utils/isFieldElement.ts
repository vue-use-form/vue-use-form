export function isFieldElement(el: unknown): el is HTMLInputElement {
  return (el as HTMLInputElement) instanceof HTMLInputElement
    || (el as HTMLInputElement) instanceof HTMLTextAreaElement
    || (el as HTMLInputElement) instanceof HTMLSelectElement
}
