import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private _snackBar: MatSnackBar) { }

  openToast(text: string) {
   this._snackBar.open(text, "Close", {
    duration: 6000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
   })
  }
}
