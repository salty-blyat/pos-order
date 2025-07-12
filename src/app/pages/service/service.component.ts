import { Component, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Service } from "./service.service";

@Component({
  selector: "app-service",
  template: `
    <div nz-flex nzGap="small" nzAlign="center" style="margin-bottom: 16px;">
      <button
        nz-button 
        nzType="text"
        (click)="router.navigate(['home'])"
      >
        <i nz-icon nzType="arrow-left"></i><span style="font-size: 16px;"> Toileteries</span>
      </button>
    </div>
    @if(isLoading){
    <app-loading></app-loading> 
    } @else if(lists.length === 0){ 
    <app-no-result-found></app-no-result-found>
    } @else if(!isLoading && lists.length > 0){
    <div *ngFor="let data of lists">
      <app-service-list [service]="data" (onClick)="onClick(data.id || 0)"></app-service-list>
    </div>
    }`,
  standalone: false,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceComponent {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) { }
  isLoading: boolean = false;
  onClick(id: number) {
    setTimeout(() => {
      this.router.navigate([`/service/${id}/operation`]);
    }, 100);
  }
  lists: Service[] = [
    {
      id: 1,
      departmentName: null,
      serviceTypeName: null,
      name: "Do Not Disturb",
      serviceTypeId: 1,
      departmentId: 2,
      maxQty: 0,
      image: null,
      description: null,
    },
    {
      id: 2,
      departmentName: null,
      serviceTypeName: null,
      name: "Frontdesk",
      serviceTypeId: 0,
      departmentId: 0,
      maxQty: 0,
      image:
        "https://core.sgx.bz/files/localhost/hotel/25/07/d154e7917fe74436ba8fa67f07941d9c.jpeg",
      description: null,
    },
    {
      id: 3,
      departmentName: null,
      serviceTypeName: null,
      name: "Soup",
      serviceTypeId: 2,
      departmentId: 3,
      maxQty: 5,
      image:
        "https://core.sgx.bz/files/localhost/hotel/25/07/3dd62aa255a349318b14f0247ce8b0f4.jpg",
      description: "-",
    },
  ];

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      console.log(params.get("id"));
    });
  }
}
