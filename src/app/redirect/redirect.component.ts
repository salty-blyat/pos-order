import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../helpers/auth.service';
import { APP_STORAGE_KEY } from '../const';
import { SettingService } from '../app-setting';

@Component({
    selector: 'app-redirect',
    template: `
      <div class="loading">
        <div class="app-loading">
          <div class="circular-progress">
            <svg viewBox="0 0 36 36">
              <path class="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>

              <path class="circle"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            </svg>
          </div>
          <img class="image-app" [src]="authService.app?.iconUrl" alt=""/>
        </div>
        <div class="text-redirect">
          {{ 'Redirecting...' | translate }}
        </div>
      </div>
    `,
    standalone: false,
    styles: [`
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        width: 100%;
      }

      .text-redirect {
        font-size: 14px;
        padding-left: 10px;
        color: #535353;
      }

      .app-loading {
        position: relative;
        margin-bottom: 20px;
      }

      i {
        font-size: 70px;
        position: absolute;
        color: #424249;
      }

      .image-app {
        width: 54px;
        height: 54px;
        padding: 6px;
        object-fit: scale-down;
      }

      .circular-progress {
        width: 80px;
        height: 80px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .circle-bg {
        fill: none;
        stroke: #d5d5d5;
        stroke-width: 1.5;
      }

      .circle {
        fill: none;
        stroke: var(--primary-color);
        stroke-width: 1.5;
        stroke-linecap: round;
        stroke-dasharray: 80, 100;
        stroke-dashoffset: 0;
        transform-origin: center;
        animation: rotateAnimation 1.5s linear infinite;
      }

      @keyframes rotateAnimation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `]
})
export class RedirectComponent implements OnInit {
  requestId: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    protected authService: AuthService,
    private router: Router,
    private settingService: SettingService,
    
  ) {}

  ngOnInit(): void {
    
    this.route.params.subscribe((params) => {
      this.requestId = params['requestId'];
      this.authService.redirectLogin({ requestId: this.requestId }).subscribe(
        (result: any) => {
          this.authService.setStorageValue({
            key: APP_STORAGE_KEY.Authorized,
            value: result,
          });
          this.authService.setStorageValue({
            key: APP_STORAGE_KEY.Tenant,
            value: result.tenant,
          });
          this.authService.setStorageValue({
            key: APP_STORAGE_KEY.App,
            value: result.app,
          });
          this.authService.updateTitleTab();
          this.router.navigate(['home']).then();
          this.loading = false;
        },
        (err: HttpErrorResponse) => {
          window.location.href = `${this.settingService.setting.AUTH_UI_URL}/auth/login`;
        }
      );
    });
  }
}
