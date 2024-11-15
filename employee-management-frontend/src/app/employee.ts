export interface Employee {
  _id?: string;
  name: string;
  designation: string;
  salary: number | null; // Allow salary to be either a number or null
}
