import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../shared/services/shared.service';
import { FormControl } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-profile-selection',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile-selection.component.html',
  styleUrl: './profile-selection.component.scss'
})
export class ProfileSelectionComponent implements OnInit {
  users: {id: string, name: string}[] = []
  userControl  = new FormControl('');

  constructor(private _dialogRef: MatDialogRef<ProfileSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _commonSvc: SharedService) {}
  
    ngOnInit(): void {
      this.users = this.data.users;
    }
    
    selectUser() {
      if (!this.userControl.value) {
        this._commonSvc.openToast("Please select a user");
        return;
      }
      console.log(this.userControl.value);
      
      this._dialogRef.close(this.userControl.value);
    }  
}
