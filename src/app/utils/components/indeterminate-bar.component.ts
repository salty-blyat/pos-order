import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-indeterminate-bar',
    template: `
    <div class="demo-container">
      <div class="progress-bar">
        <div class="progress-bar-value"></div>
      </div>
    </div>
  `,
    styles: [
        `
      .demo-container {
        margin: auto;
      }

      .progress-bar {
        height: 2px;
        background-color: rgba(5, 114, 206, 0.2);
        width: 100%;
        overflow: hidden;
      }

      .progress-bar-value {
        width: 100%;
        height: 100%;
        background-color: var(--primary-color);
        animation: indeterminateAnimation 1s infinite linear;
        transform-origin: 0% 50%;
      }

      @keyframes indeterminateAnimation {
        0% {
          transform: translateX(0) scaleX(0);
        }
        40% {
          transform: translateX(0) scaleX(0.4);
        }
        100% {
          transform: translateX(100%) scaleX(0.5);
        }
      }
    `,
    ],
    standalone: false
})
export class IndeterminateBarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
