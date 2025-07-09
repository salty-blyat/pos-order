import { Component, ViewEncapsulation } from "@angular/core";
@Component({
  selector: "app-home",
  template: `
    <nz-layout>
      <nz-content>
        <div style="display: grid; grid-template-columns: minmax(124px, 220px) minmax(150px, auto) 250px; gap: 0 8px;">

          <div  class="screen-scroll hide-scrollbar">
            <div class="brand">
              <img src="{{ logo }}" alt="" />
            </div>
            <nz-sider nzTheme="light">
              <app-category-buttons
                (categoryChange)="onCategoryChange($event)"
              ></app-category-buttons>
            </nz-sider>
          </div>
          <div   style="position:relative;">
            <div class="search-input-container"> 
                <nz-input-group style="margin-top: 24px;" [nzPrefix]="iconTem" [nzSuffix]="clearTem">
                  <input
                    style="border-radius:0;"
                    nz-input
                    placeholder="ស្វែងរក"
                    [(ngModel)]="searchTerm"
                  />
                </nz-input-group>
                <ng-template #iconTem
                  ><nz-icon nzType="search" nzTheme="outline"
                /></ng-template>
                <ng-template #clearTem>
                  <nz-icon
                    *ngIf="searchTerm.length > 0"
                    nzType="close"
                    nzTheme="outline"
                    (click)="searchTerm = ''"
                  />
                </ng-template> 
            </div>

            <div class="screen-scroll hide-scrollbar">
              <div 
                nz-row
                [nzGutter]="['8', '8']"
                style="padding: 72px 4px 32px 0px;"
              >
                <div
                  nz-col
                  nzSm="12"
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
          </div>
          <div   class="screen-scroll " *ngIf="showCart" >
            <nz-sider nzTheme="light">
              <app-cart></app-cart>
            </nz-sider>
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
      .brand {
        display: flex;
        padding: 16px 0 0 16px;
        justify-content: center;
        img {
          width: 52px;
        }
      }
      .search-input-container {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        padding: 0px 4px;
        background-color: #eeeeee;
        height: 56px;
      } 
      .ant-row{
        margin: 0 !important;
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
  showCart = true;
  radioValue: string = "All";
  onCategoryChange(value: string): void {
    this.radioValue = value;
  }
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
    "https://core.sgx.bz/files/trump/hr/24/12/a2081ae24a8a43f7ab3c3e56ac453f87.png";
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
    {
      src: "https://source.unsplash.com/300x200/?soup",
      title: "Creamy Tomato Soup",
      price: "$4.99",
      description: "Fresh tomato soup.",
      category: "Soup",
    },
    {
      src: "https://source.unsplash.com/300x200/?icecream",
      title: "Mango Ice Cream",
      price: "$5.99",
      description: "Sweet mango ice cream.",
      category: "Dessert",
    },
    {
      src: "https://source.unsplash.com/300x200/?chickenwings",
      title: "Spicy Chicken Wings",
      price: "$12.99",
      description: "Spicy chicken wings.",
      category: "Chicken Wings",
    },
    {
      src: "https://source.unsplash.com/300x200/?sushirolls",
      title: "Sushi Rolls",
      price: "$14.50",
      description: "Various sushi rolls.",
      category: "Sushi",
    },
    {
      src: "https://source.unsplash.com/300x200/?steakhouse",
      title: "Steakhouse Steak",
      price: "$19.99",
      description: "Grilled steak with gried potatoes.",
      category: "Steak",
    },
    {
      src: "https://source.unsplash.com/300x200/?breakfast",
      title: "Breakfast Plate",
      price: "$8.99",
      description: "Scrambled eggs, bacon, and toast.",
      category: "Breakfast",
    },
    {
      src: "https://source.unsplash.com/300x200/?burrito",
      title: "Chicken Burrito",
      price: "$10.99",
      description: "Soft burrito with grilled chicken and salsa.",
      category: "Burrito",
    },
    {
      src: "https://source.unsplash.com/300x200/?chickenparmesan",
      title: "Chicken Parmesan",
      price: "$12.99",
      description: "Breaded chicken with marinara sauce and melted mozzarella.",
      category: "Parmesan",
    },
    {
      src: "https://source.unsplash.com/300x200/?fries",
      title: "French Fries",
      price: "$4.99",
      description: "Crunchy fries.",
      category: "Fries",
    },
    {
      src: "https://source.unsplash.com/300x200/?phillycheese",
      title: "Philly Cheese Steak",
      price: "$14.99",
      description: "Thinly sliced steak and melted cheese on a hoagie roll.",
      category: "Philly Cheese Steak",
    },
  ];
}
