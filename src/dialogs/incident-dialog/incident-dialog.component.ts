import { Component, inject, model, signal } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';

export interface IncidentDialogData {
  value: {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    created_at: string;
    resolved_date: string;
  },
  action: string,
  adminUser: boolean
}

@Component({
  selector: 'app-incident-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    MatDatepickerModule,
    MatGridListModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './incident-dialog.component.html',
  styleUrl: './incident-dialog.component.scss'
})
export class IncidentDialogComponent {
  readonly priorities = ["Open", "Medium", "High"];
  readonly statuses = ["Open", "In-Progress", "Resolved"];
  readonly dialogRef = inject(MatDialogRef<IncidentDialogComponent>);
  readonly data = inject<IncidentDialogData>(MAT_DIALOG_DATA);
  public id = model(this?.data?.value?.id);
  public title = model(this?.data?.value?.title);
  public description = model(this?.data?.value?.description);
  public priority = model(this?.data?.value?.priority);
  public status = model(this?.data?.value?.status || "Open");
  public created_at = model(this?.data?.value?.created_at?.split("T")[0]);
  public resolved_date = model(this?.data?.value?.resolved_date);
  public action = model(this?.data?.action);

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.dialogRef.close({
      id: this.id(),
      title: this.title(),
      description: this.description(),
      priority: this.priority(),
      status: this.status(),
      created_at: this.created_at(),
      resolved_date: this.resolved_date(),
      action: this.action()
    })
  }
}
