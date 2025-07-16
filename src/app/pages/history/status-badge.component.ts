import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Request, RequestStatus } from "../../pages/request/request.service";
@Component({
  selector: "app-status-badge",
  template: `
    <span 
    class="badge"  > 
      <img [src]="img" [alt]="statusText" /> 
      {{ statusText }}
    </span>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .badge {
        display:flex;
        align-items: center;
        width: fit-content;
        color: black;
        gap:4px;
        font-size: 12px;
        text-wrap: nowrap;
        img{
            border-radius: 4px;width: 16px; height:auto; margin-bottom:1px;
        }
      }
    `,
  ],
  standalone: false,
})
export class StatusBadgeComponent {
  @Input() status: RequestStatus = RequestStatus.Pending;
  @Input() img: string = './../../../assets/image/noimg.jpg';
  @Input() statusText: string = '';

  readonly requestStatus = RequestStatus;

}
