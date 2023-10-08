import { Contact } from "@/types/global";

export const paginate = (items:Contact[], pageNumber:number, pageSize:number, favorite:string[]) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return items
    .filter((filter) => !favorite.includes(filter.id))
    .slice(startIndex, startIndex + pageSize);
};
