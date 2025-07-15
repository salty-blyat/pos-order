import { Component, ViewEncapsulation } from "@angular/core";
@Component({
  selector: "app-not-found-page",
  template: `
<div class="not-found-container">
  <div class="not-found-content">
    <h1>404</h1>
    <p>Sorry, the page you're looking for doesn't exist.</p> 
  </div>
</div>

  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles: [
    `
     .not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background-color: #f5f5f5;
  text-align: center;
  padding: 2rem;
}

.not-found-content {
  max-width: 500px;

  h1 {
    font-size: 96px;
    color: #1890ff;
    margin: 0;
  }

  p {
    font-size: 18px;
    margin: 20px 0;
    color: #595959;
  }

  .back-home {
    display: inline-block;
    padding: 10px 20px;
    background-color: #1890ff;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;

    &:hover {
      background-color: #40a9ff;
    }
  }
}

    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class NotFoundPageComponent {
}
