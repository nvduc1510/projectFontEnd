import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent {
  message: string = '';
  constructor(private router: Router){}
  
  ngOnInit() : void {
    this.message = history.state.messageInf;
    const messageFromHistory = history.state.messageInf;
    if (messageFromHistory) {
      // Lưu thông báo vào sessionStorage
      sessionStorage.setItem('message', messageFromHistory);
      this.message = messageFromHistory;
    } else {
      // Kiểm tra xem có thông báo trong sessionStorage không
      const messageFromSession = sessionStorage.getItem('message');
      if (messageFromSession) {
        this.message = messageFromSession;
      }
    }
  }
  // Chuyển hướng đến màn List
  navigateToList() {
    // Xóa thông báo từ sessionStorage
    sessionStorage.removeItem('message');
    // Chuyển hướng sang màn hình List
    this.router.navigate(['user/list']);
  }
}
