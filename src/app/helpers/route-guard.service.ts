import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { SessionStorageService } from "../utils/services/sessionStorage.service";
@Injectable({ providedIn: "root" })
export class RouteGuardService implements CanActivate {
  constructor(
    public router: Router,
    private sessionService: SessionStorageService
  ) { }
  canActivate(): boolean {
    const guestId = this.sessionService.getValue("guestId");
    const reservationId = this.sessionService.getValue("reservationId");
    const roomId = this.sessionService.getValue("roomId");
    const isVerified = this.sessionService.getValue(
      `isVerified-${guestId}-${reservationId}-${roomId}`
    );

    if (isVerified !== true) {
      this.router.navigate(["/not-found"]);
      return false;
    }

    return true;
  }
}
