import { Component, Inject, Input } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogActions, MatDialogContent, MAT_DIALOG_DATA, MatDialogModule, MatDialog, MatDialogTitle, MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.html',
  standalone: true,
  styleUrl: './delete-dialog.scss',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ]
})
export class DeleteDialog {
  constructor(public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { filename: string }) { }
}
