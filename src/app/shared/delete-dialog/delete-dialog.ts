import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MatDialogActions, MatDialogContent, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.html',
  standalone: true,
  styleUrl: './delete-dialog.scss',
  imports: [
    MatDialogModule,
  ]
})
export class DeleteDialog {
  @Input('fileName') fileName: string = "";

  constructor(public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { filename: string }) { }
}
