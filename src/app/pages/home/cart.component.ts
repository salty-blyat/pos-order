import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-cart",
  template: `
    <div class="cart hide-scrollbar">
      <div
        style="margin-top:8px;"
        nz-flex
        nzAlign="normal"
        nzJustify="space-between"
      >
        <div style="line-height: 1.2;">
          <span class="cart-title">Order #001</span> <br />
          <span class="order-number"> Wed, 9 July 2025, 10:30 AM </span>
        </div>
        <div class="table-badge">A04</div>
      </div>
      <hr />
      <div>
        <span class="cart-title">Ordered Detail</span>
        <div
          style="margin-top: 12px !important;"
          nz-row
          *ngFor="let dish of dish"
        >
          <span nz-col nzSpan="20" class="item-name">{{ dish.name }}</span>
          <span nz-col nzSpan="4" class="item-price">{{
            "$" + dish.price
          }}</span>
          <a nz-col nzSpan="12" class="item-notes"
            ><nz-icon nzType="form" nzTheme="outline" />
            Notes
          </a>
          <div nz-col nzSpan="12">
            <div nz-flex nzJustify="end" nzAlign="center" nzGap="4px">
              <button nz-button nzSize="small" (click)="decreaseQty(dish)">
                <nz-icon nzType="minus" nzTheme="outline"></nz-icon>
              </button>
              <span class="item-quantity">{{ dish.quantity }}</span>
              <button
                nz-button
                nzSize="small"
                nzType="primary"
                (click)="increaseQty(dish)"
              >
                <nz-icon nzType="plus" nzTheme="outline"></nz-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div style="margin-bottom:12px;">
        <span class="cart-title">Payment Summary</span>
        <div class="payment-summary" nz-flex nzJustify="space-between">
          <span>Subtotal (4 items)</span>
          <span>$11.48</span>
        </div>
        <div class="payment-summary" nz-flex nzJustify="space-between">
          <span>Discount</span>
          <span>$0.00</span>
        </div>
      </div>
      <div
        style="position:fixed;bottom: 12px; right: 12px;"
      >
        <button nz-button nzType="primary" class="order-button">
          <span style="font-weight: bold; margin-right: 8px;">$12.62</span>
          Proceed Order
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .item-notes {
        font-size: 11px;
        margin-top: auto;
      }
      .table-badge {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        background-color: #0054e9;
        justify-content: center;
        font-size: 12px;
        color: white;
        border-radius: 8px;
      }
      .order-button {
        width: 224px;
        font-size: 12px;
        margin-top: 8px;
      }
      .payment-summary {
        margin-top: 4px;
        font-size: 11px;
      }
      hr {
        margin: 8px 0;
        border: 1px dotted #8080801a;
      }
      .cart {
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.34);
        overflow-y: auto;
        padding: 16px 16px 32px 16px;
        background-color: white;
        height: 100%;
      }
      .item-quantity {
        font-size: 11px;
        padding: 0 8px;
      }
      .item-price {
        text-align: right;
        font-size: 12px;
        font-weight: bold;
      }
      .item-name {
        font-size: 12px;
      }
      .item {
        font-size: 11px;
        font-weight: 500;
        line-height: 1.4;
      }
      // color:hsl(0, 0.00%, 50.20%);
      .cart-title {
        font-size: 14px;
        color: #343434;
        font-weight: bold;
      }
      .order-number {
        font-size: 12px;
        color: grey;
      }
      .ant-btn-icon-only.ant-btn-sm {
        border-radius: 8px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CartComponent {
  @Input() title!: string;
  @Input() price!: string;
  @Input() description!: string;
  @Input() src!: string;
  increaseQty(dish: any): void {
    dish.quantity++;
  }

  decreaseQty(dish: any): void {
    if (dish.quantity > 1) {
      dish.quantity--;
    }
  }

  dish = [
    {
      id: 1,
      name: "Orange Juice",
      description: "Note: Less Ice",
      price: 2.87,
      quantity: 4,
      image: "https://source.unsplash.com/300x200/?pizza",
    },
    {
      id: 2,
      name: "American Favorite",
      description: "Crust: Stuffed Crust Sosis\nExtras: Extra Mozarella",
      price: 4.87,
      quantity: 1,
      image: "https://source.unsplash.com/300x200/?pizza",
    },
    {
      id: 3,
      name: "Spicy Italian Sausage",
      description: "Note: No Spicy",
      price: 5.87,
      quantity: 2,
      image: "https://source.unsplash.com/300x200/?spicy",
    },
    {
      id: 4,
      name: "Hawaiian Luau",
      description: "Note: Extra Ham",
      price: 6.87,
      quantity: 3,
      image: "https://source.unsplash.com/300x200/?hawaiian",
    },
  ];
}
