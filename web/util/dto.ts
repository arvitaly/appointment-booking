export function readDataFromElement(elementId: string) {
  const pageDataElement = document.getElementById(elementId);

  if (!pageDataElement) {
    throw new Error("Not found a page data element");
  }
  if (!pageDataElement.textContent) {
    throw new Error("Empty page data");
  }

  return JSON.parse(pageDataElement.textContent);
}
