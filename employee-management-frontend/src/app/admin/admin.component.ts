import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';
import { ActivatedRoute, Router } from '@angular/router';
import { PerformanceReviewService } from '../performance-review.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  employee = { name: '', designation: '', salary: null };
  alertMessage: string | null = null;
  employees: any[] = [];
  isEditing = false;
  currentEmployeeId: string | null = null;

  review = {
    employeeId: '',
    employeeName: '',
    reviewText: '',
    rating: 0,
    date: new Date(),
  };
  reviews: any[] = [];
  filteredReviews: any[] = [];
  currentReviewId: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private reviewService: PerformanceReviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getReviews();
  }

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe((response: any) => {
      this.employees = response;
    });
  }

  addEmployee(): void {
    const employeeData = {
      name: this.employee.name,
      designation: this.employee.designation,
      salary: this.employee.salary,
    };

    this.employeeService
      .addEmployee(employeeData)
      .subscribe((response: any) => {
        console.log('Employee added', response);
        this.alertMessage = 'Employee added successfully!';
        this.getEmployees();
        this.resetForm();
        this.autoDismissAlert();
      });
  }

  editEmployee(employee: any): void {
    this.isEditing = true;
    this.currentEmployeeId = employee._id;
    this.employee = { ...employee };
  }

  updateEmployee(): void {
    const employeeData = {
      name: this.employee.name,
      designation: this.employee.designation,
      salary: this.employee.salary,
    };

    this.employeeService
      .updateEmployee(this.currentEmployeeId!, employeeData)
      .subscribe((response: any) => {
        this.alertMessage = 'Employee updated successfully!';
        this.getEmployees();
        this.resetForm();
        this.autoDismissAlert();
      });
  }

  deleteEmployee(id: string): void {
    this.employees = this.employees.filter((e) => e._id !== id);

    this.employeeService.deleteEmployee(id).subscribe(
      (response: any) => {
        this.getEmployees();
        this.alertMessage = 'Employee deleted successfully!';
        this.autoDismissAlert();
      },
      (error) => {
        this.getEmployees();
        this.alertMessage = ' deleting employee!';
        this.autoDismissAlert();
      }
    );
  }

  resetForm(): void {
    this.employee = { name: '', designation: '', salary: null };
    this.isEditing = false;
    this.currentEmployeeId = null;
  }

  getReviews(): void {
    this.reviewService.getReviews().subscribe((response: any) => {
      this.reviews = response;
      this.filteredReviews = this.reviews; // Set filteredReviews initially
    });
  }

  addReview(): void {
    const reviewData = {
      employeeId: this.review.employeeId,
      employeeName: this.review.employeeName,
      reviewText: this.review.reviewText,
      rating: this.review.rating,
    };

    this.reviewService.addReview(reviewData).subscribe((response: any) => {
      this.alertMessage = 'Performance review added successfully!';
      this.getReviews();
      this.resetForms();
      this.autoDismissAlert();
    });
  }

  editReview(review: any): void {
    this.isEditing = true;
    this.currentReviewId = review._id;
    this.review = { ...review };
  }

  updateReview(): void {
    const reviewData = {
      employeeId: this.review.employeeId,
      reviewText: this.review.reviewText,
      rating: this.review.rating,
    };

    this.reviewService
      .updateReview(this.currentReviewId!, reviewData)
      .subscribe((response: any) => {
        this.alertMessage = 'Performance review updated successfully!';
        this.getReviews();
        this.resetForms();
        this.autoDismissAlert();
      });
  }

  deleteReview(id: string): void {
    this.reviews = this.reviews.filter((review) => review._id !== id);

    this.reviewService.deleteReview(id).subscribe(
      (response: any) => {
        this.getReviews();
        this.alertMessage = 'Performance review deleted successfully!';
        this.autoDismissAlert();
      },
      (error) => {
        this.getReviews();
        this.alertMessage = ' deleting review!';
        this.autoDismissAlert();
      }
    );
  }

  searchReviews(event: any): void {
    const query = event.target.value.toLowerCase();
    this.filteredReviews = this.reviews.filter(
      (review) =>
        review.employeeName.toLowerCase().includes(query) ||
        review.reviewText.toLowerCase().includes(query)
    );
  }

  resetForms(): void {
    this.review = {
      employeeId: '',
      employeeName: '',
      reviewText: '',
      rating: 0,
      date: new Date(),
    };
    this.isEditing = false;
    this.currentReviewId = null;
  }

  autoDismissAlert(): void {
    setTimeout(() => {
      this.alertMessage = null;
    }, 3000);
  }
  logout() {
    localStorage.setItem('userLoggedIn', 'false');
    this.router.navigate(['/login']);
  }
}
