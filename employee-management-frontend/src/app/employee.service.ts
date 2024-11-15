import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from './employee';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/employees'; // Your backend API URL

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addEmployee(employeeData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employeeData);
  }

  updateEmployee(id: string, employeeData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, employeeData);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
