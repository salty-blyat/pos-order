import { Component, ViewEncapsulation } from "@angular/core"; 

@Component({
  selector: "app-thankyou",
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="thankyou-wrapper">
      <div class="card">
        <div class="card-header">
          <h1 class="card-title">{{"Thank You!" | translate}}</h1>
          <p class="card-description">{{"For using our hotel service." | translate}}</p>
        </div>
        <div class="card-content">
          <p>
            {{"We appreciate your trust in us and hope you had a seamless experience." | translate}}
            {{"We look forward to serving you again soon!" | translate}}
          </p>
          <button nz-button nzType="primary"   routerLink="/">{{"Go to Homepage" | translate}}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .thankyou-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      min-height: 100vh;
      background-color: #f3f4f6;
    }

    .card {
      background-color: #ffffff;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
      width: 100%;
      max-width: 28rem;
      text-align: center;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #1f2937;
    }

    .card-description {
      font-size: 1.125rem;margin-bottom: 0px;
      color: #4b5563;
    }

    .card-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .card-content p {
      font-size: 1rem;
      color: #374151;
      line-height: 1.5;
    }
 
  `]
})
export class ThankYouComponent {  
}
