import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmationModalService } from '../modals/confirmation-modal/confirmation-modal.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent {
  constructor(
    public authService: AuthService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  onLogout() {
    const modalRef = this.confirmationModalService
      .confirm('Logout', `Are you sure you want to logout?`, 'Yes', 'Cancel')
      .then((res) => {
        if (res === true) {
          this.authService.logout();
        }
      });
  }
}
