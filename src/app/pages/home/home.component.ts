import { Component, ViewEncapsulation } from "@angular/core";
import { ServiceType } from "./home.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-home",
  template: `
    <div class="card-container" nz-row [nzGutter]="[8, 8]">
      <div nz-col xs="24" sm="12">
        <div nz-flex nzGap="small" nzAlign="center">
          <div class="avatar">SJ</div>
          <strong style="font-size: 16px;">Welcome back, Sarah Johnson</strong>
          ✨
        </div>
      </div>

      <div nz-col xs="24" sm="12" class="room-details">
        <div class="room-number">Room 301 - Deluxe Suite</div>
        <div class="stay-info">
          <span class="nights">3 Nights</span><br />
          <span class="date-range">Dec 15, 2024 - Dec 18, 2024</span>
        </div>
      </div>
    </div>

    <div class="header-home">
      <h2>How can we assist you today?</h2>
    </div>
    @if(isLoading){
    <app-loading></app-loading>

    } @else if(lists.length === 0){

    <app-no-result-found></app-no-result-found>
    } @else if(!isLoading && lists.length > 0){
    <div nz-row [nzGutter]="[8, 8]">
      <div
        nz-col
        nzXs="12"
        nzSm="8"
        nzLg="6"
        nzXL="6"
        *ngFor="let data of lists"
      >
        <app-service-type-card
          (onClick)="onClick($event)"
          [serviceType]="data"
        ></app-service-type-card>
      </div>
    </div>

    }
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles: [
    `
      .header-home {
        margin-bottom: 8px;
        padding: 32px 0 0 0;
        h2 {
          font-weight: bold;
        }
      }
      .room-details {
        font-size: 13px;
        font-weight: 400;
      }

      .room-number {
        font-weight: 600;
        color: #1e88e5;
      }

      .nights {
        color: #2e7d32;
        font-weight: 600;
      }

      .date-range {
        font-size: 12px;
        color: #888;
      }

      .card-container {
        display: flex;
        width: 100%;
        user-select: none;
        background-color: white;
        align-items: center;
        margin-left: 0 !important;
        padding: 8px;
        border-radius: 8px;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        font-family: "Segoe UI", sans-serif;
        position: relative;
        // margin: 24px 8px 8px 8px !important;
        border-top: 3px solid #9c27b0; /* gradient illusion */
      }

      .avatar {
        width: 48px;
        height: 48px;
        background-color: #3f51b5;
        color: white;
        border-radius: 12px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class HomeComponent {
  isLoading: boolean = false;
  constructor(private router: Router) { }
  onClick(id: number) {
    setTimeout(() => {
      this.router.navigate([`/service/${id}`]);
    }, 100);
  }
  lists: ServiceType[] = [
    {
      id: 1,
      name: "cleaning",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 2,
      name: "wakeup",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 3,
      name: "taxi",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 4,
      name: "toiletries",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 5,
      name: "towels",
      image:
        "https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 6,
      name: "complimentary",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 7,
      name: "restaurant",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&crop=center",
    },
    { id: 8, name: "room-dining" },
    {
      id: 9,
      name: "bar",
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 10,
      name: "gym",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 11,
      name: "pool",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 12,
      name: "spa",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop&crop=center",
    },
    {
      id: 13,
      name: "business",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center",
    },
  ];

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
