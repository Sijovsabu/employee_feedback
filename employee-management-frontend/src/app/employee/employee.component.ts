import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { PerformanceReviewService } from '../performance-review.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employee = { name: '', designation: '', salary: null };
  alertMessage: string | null = null;
  employees: any[] = [];
  isEditing = false;
  currentEmployeeId: string | null = null;

  ///// Review Section
  review = {
    employeeId: '',
    employeeName: '',
    reviewText: '',
    rating: 0,
    date: new Date(),
  };
  reviews: any[] = [];
  currentReviewId: string | null = null;

  // Pagination Variables
  currentPage: number = 1;
  pageSize: number = 3; // Number of reviews per page
  totalPages: number = 0;
  paginatedReviews: any[] = [];

  // Search Variables
  searchQuery: string = '';
  filteredReviews: any[] = [];

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

  // Get Employees (unchanged)
  getEmployees(): void {
    this.employeeService.getEmployees().subscribe((response: any) => {
      this.employees = response;
    });
  }

  // Get Reviews with Pagination
  getReviews(): void {
    this.reviewService.getReviews().subscribe((response: any) => {
      this.reviews = response;
      this.totalPages = Math.ceil(this.reviews.length / this.pageSize); // Calculate total pages
      this.filteredReviews = this.reviews; // Set filtered reviews initially
      this.paginateReviews(); // Paginate reviews when data is fetched
    });
  }

  // Pagination Logic
  paginateReviews(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedReviews = this.filteredReviews.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateReviews();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateReviews();
    }
  }

  addReview(): void {
    const reviewData = {
      employeeId: this.review.employeeId,
      employeeName: this.review.employeeName,
      reviewText: this.review.reviewText,
      rating: this.review.rating,
    };
    console.log('Review Data:', reviewData);
    this.reviewService.addReview(reviewData).subscribe((response: any) => {
      console.log('Review added', response);
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
    // Optimistically remove the review from the list
    this.reviews = this.reviews.filter((r) => r._id !== id);

    this.reviewService.deleteReview(id).subscribe(
      (response: any) => {
        this.getReviews();
        this.alertMessage = 'Performance review deleted successfully!';
        this.autoDismissAlert();
      },
      (error) => {
        this.getReviews(); // Refresh in case of error
        this.alertMessage = 'Error deleting performance review!';
        this.autoDismissAlert();
      }
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

  // Search Logic
  onSearchChange(): void {
    if (this.searchQuery) {
      this.filteredReviews = this.reviews.filter((review) =>
        review.employeeName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredReviews = this.reviews;
    }
    this.totalPages = Math.ceil(this.filteredReviews.length / this.pageSize);
    this.paginateReviews();
  }
  logout() {
    localStorage.setItem('userLoggedIn', 'false');
    this.router.navigate(['/login']);
  }
}
