export function paginate<T>(arr: T[], elementsPerPage: number) {
  type Page = T[];
  const book: Page[] = [];
  for (let i = 0; i < arr.length; i += elementsPerPage) {
    book.push(arr.slice(i, i + elementsPerPage));
  }
  return book;
}
