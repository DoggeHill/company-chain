import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PinataConfigCid } from '../../shared/pinata-credentials';

@Component({
  selector: 'app-credentials-dialog',
  templateUrl: './credentials-dialog.component.html',
  styleUrl: './credentials-dialog.component.scss',
})
export class CredentialsDialogComponent implements OnInit {
  formGroup: FormGroup | null = null;

  constructor(
    public dialogRef: MatDialogRef<CredentialsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PinataConfigCid,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({
      pinataConfigCid: this.fb.control('QmbG9G7Ymev5NCD8fLiPzWkKEpFMg9fFsaiGRRnguDMKmX', [Validators.required, Validators.maxLength(100)]),
    });
    this.formGroup.enable();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if(this.formGroup?.invalid) {
      return;

    } 
    
    this.dialogRef.close({'cid': this.formGroup?.get('pinataConfigCid')?.value} as PinataConfigCid);
  }
}
