import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PerformanceReviewService {
  private apiUrl = 'http://localhost:3000/reviews'; // Replace with your API URL
  private employeeReviewsUrl = 'http://localhost:3000/employees'; // URL for employee-specific reviews

  constructor(private http: HttpClient) {}

  // Create a performance review
  addReview(review: any): Observable<any> {
    return this.http.post(this.apiUrl, review);
  }

  // Get all performance reviews
  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get reviews for a specific employee
  getReviewsByEmployee(employeeId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.employeeReviewsUrl}/${employeeId}/reviews`
    );
  }

  // Update a performance review
  updateReview(id: string, review: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, review);
  }

  // Delete a performance review
  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
