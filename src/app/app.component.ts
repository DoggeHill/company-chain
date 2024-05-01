import { StartupComponent } from './startup/startup.component';
import { AfterViewInit, Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, delay, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Web3Service } from './services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('startup')
  startupComponent!: StartupComponent;

  links = [
    {
      href: '/',
      name: 'Dashboard',
      isActive: true,
      icon: 'assignment',
    },
    {
      href: 'user-list',
      name: 'User list',
      isActive: true,
      icon: 'person',
    },
  ];
  isLoading = new BehaviorSubject(true);

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private snackBar: MatSnackBar,
    public web3Service: Web3Service
  ) {
    this.onActivate();
  }

  ngAfterViewInit(): void {
    this.startupComponent
      .init()
      .pipe(delay(1000), tap(() => {this.isLoading.next(false)}))
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('All set!', 'Close', {
            duration: 2000, // Set the duration in milliseconds
          });
          this.router.navigate(['/']);
          this.isLoading.next(false)
        } else {
          window.location.href = 'https://sk.wikipedia.org/wiki/Chyba';
        }
      });
  }

  onActivate() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
}
