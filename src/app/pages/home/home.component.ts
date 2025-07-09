import { Component, ViewEncapsulation } from "@angular/core";
@Component({
  selector: "app-home",
  template: `
    <nz-layout>
      <nz-content>
        <div nz-row [nzGutter]="[8, 8]">
          <div nz-col nzSpan="4">
            <nz-radio-group
              class="category-group"
              nzButtonStyle="outline"
              [(ngModel)]="radioValue"
            >
              <label nz-radio-button nzValue="All">All</label>
              <label nz-radio-button nzValue="Pizza">Pizza</label>
              <label nz-radio-button nzValue="Burger">Burger</label>
              <label nz-radio-button nzValue="Sushi">Sushi</label>
              <label nz-radio-button nzValue="Steak">Steak</label>
            </nz-radio-group>
          </div>
          <div nz-col nzSpan="14">
            <div nz-row [nzGutter]="[8, 8]">
              <div nz-col nzSpan="24">
                <nz-input-group
                  nzSearch
                  [nzAddOnAfter]="suffixButton"
                  class="search-input"
                  style="width: 100%; max-width: 480px;"
                  ><input
                    type="text"
                    nz-input
                    placeholder="Search"
                    [(ngModel)]="searchTerm"
                  />
                </nz-input-group>
                <ng-template #suffixButton>
                  <button nz-button nzSearch>
                    <nz-icon nzType="search" />
                  </button>
                </ng-template>
              </div>
              <div
                nz-col
                nzSpan="8"
                nzMd="8"
                nzLg="6"
                nzXl="4"
                nzXXl="3"
                *ngFor="let dish of filteredDishes"
              >
                <app-dish
                  [src]="dish.src"
                  [title]="dish.title"
                  [price]="dish.price"
                ></app-dish>
              </div>
            </div>
          </div>
          <div nz-col nzSpan="6" class="cart-container" *ngIf="showCart">
            <app-cart></app-cart>
          </div>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles: [
    `
      .category-group {
        display: flex !important;
        flex-direction: column;
        gap: 12px !important;
      }
      .ant-radio-button-wrapper {
        // border-radius: 24px;
        padding: 0 24px;
      }
      .dish-container {
        overflow: auto;
      }
      .logo {
        height: 52px;
        width: 52px;
      }
      .cart-container {
        height: 100%;
        overflow: auto;
      }
      nz-layout {
        background-color: #f9fafb !important;
        nz-content {
          padding: 12px;
          background-color: white;
        }
      }

      .search-input {
        max-width: 200px;
        input {
          border-radius: 12px 0 0 12px !important;
        }
        button {
          border-radius: 0 12px 12px 0 !important;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class HomeComponent {
  isLoading = false;
  searchTerm = "";
  showFooter = false;
  radioValue = "All";
  showCart = true;

  get filteredDishes() {
    return this.dishes.filter((dish) => {
      const matchesCategory =
        this.radioValue === "All" || dish.category === this.radioValue;
      const matchesSearch = this.searchTerm
        ? dish.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }
  logo =
    "https://core.sgx.bz/files/prosit/inv/24/11/f6cf4901eeab485d8fd1c94a98d3b66b.png";
  dishes = [
    {
      src: "https://eu.ooni.com/cdn/shop/articles/pepperoni-pizza_6ac5fa40-65b7-4e3b-a8b9-7ca5ccc05dfd.jpg?crop=center&height=800&v=1737105987&width=800",
      title: "Pepperoni Pizza",
      price: "$12.99",
      description: "Classic .",
      category: "Pizza",
    },
    {
      src: "https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1:1/w_2560%2Cc_limit/Smashburger-recipe-120219.jpg",
      title: "Cheeseburger",
      price: "$9.99",
      description: "Juicy .",
      category: "Burger",
    },
    {
      src: "https://aisforappleau.com/wp-content/uploads/2023/07/how-to-make-sushi-salmon-nigiri-6.jpg",
      title: "Salmon Sushi",
      price: "$14.50",
      description: "Fresh .",
      category: "Sushi",
    },
    {
      src: "https://img.chefkoch-cdn.de/rezepte/1298241234947062/bilder/1590571/crop-360x240/carbonara-wie-bei-der-mamma-in-rom.jpg",
      title: "Spaghetti Carbonara",
      price: "$11.75",
      description: "Creamy pastaese.",
      category: "Carbonara",
    },
    {
      src: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2010/4/26/0/FNM_060110-Bobby-Grilling-013_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1382539247827.webp",
      title: "Grilled Steak",
      price: "$19.99",
      description: "Gried potatoes.",
      category: "Steak",
    },
    {
      src: "https://source.unsplash.com/300x200/?tacos",
      title: "Chicken Tacos",
      price: "$8.99",
      description: "Soft tacos with grilled chicken and salsa.",
      category: "Tacos",
    },
    {
      src: "https://source.unsplash.com/300x200/?ramen",
      title: "Tonkotsu Ramen",
      price: "$13.50",
      description: "Pork bro",
      category: "Ramen",
    },
    {
      src: "https://source.unsplash.com/300x200/?salad",
      title: "Caesar Salad",
      price: "$7.50",
      description: "Romaine lnd crouton.",
      category: "Salad",
    },
    {
      src: "https://source.unsplash.com/300x200/?curry",
      title: "Chicken Curry",
      price: "$10.25",
      description: "Spicy Indian curice.",
      category: "Curry",
    },
    {
      src: "https://source.unsplash.com/300x200/?pancake",
      title: "Blueberry Pancakes",
      price: "$6.99",
      description: "Fluffy panup.",
      category: "Pancakes",
    },
  ];
}
