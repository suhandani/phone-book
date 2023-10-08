export interface Phones {
    number: string;
  }
  
export interface Contact {
    id: string;
    first_name: string;
    last_name: string;
    phones: Phones[];
  }
  
export type Data = {
    contact: Contact[];
}