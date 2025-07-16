import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-not-found-page",
  template: `
    <div class="not-found-wrapper">
      <div class="card">
        <div class="card-header">
          <h1 class="card-title">{{"Room Not Found" | translate}}</h1>
          <p class="card-description">{{"We apologize for the inconvenience." | translate}}</p>
        </div>
        <div class="card-content">
          <p>
            {{"We cannot find the room you're staying in. Please contact our staff at the lobby for more information." | translate}}
          </p>
          <!-- <button nz-button nzType="primary" nzDanger routerLink="/">Go to Homepage</button> -->
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-wrapper {
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
      color: #ef4444;
    }

    .card-description {
      font-size: 1.125rem;
      color: #4b5563;margin-bottom: 0px;
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
  `],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class NotFoundPageComponent { }
