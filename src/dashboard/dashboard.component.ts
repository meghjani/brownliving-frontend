import { Component, ViewChild, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';

import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { IncidentDialogComponent } from '../dialogs/incident-dialog/incident-dialog.component';

export interface Incident {
  id: number,
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string,
  resolved_date: string,
  user: string
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    NgxEchartsDirective
  ],
  providers: [provideEcharts()],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  displayedColumns: string[] = ['title', 'description', 'priority', 'status', 'created_at', 'resolved_date', 'action'];
  dataSource = new MatTableDataSource<Incident>();
  adminUser = false;
  userEmail = "";

  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  chartOption: EChartsOption = {};

  constructor(public auth: AuthService, private apiService: ApiService) {
    auth.user$.subscribe((u: any) => {
      // TODO: API CORS issue with auth0, this will fetch the role for us
      // In Network we are able to call the token from SPA call
      // this.apiService.setAuth0Token()
      //   .subscribe(token => {
      //     // console.log(token)
      //     this.apiService.getAuth0UsersRole(u?.sub?.toString(), token?.access_token)
      //       .subscribe(roleDetails => {
      //         console.log(roleDetails)
      //       })
      //   })

      // Fetch users incidents
      this.userEmail = u.email;
      this.apiService.getUsersIncidents(u.email)
        .subscribe(res => {
          this.dataSource = new MatTableDataSource<Incident>(res.data);
          this.dataSource.paginator = this.paginator;

          const created_dates = res.data.map((r: any) => r.created_at)
          const combinedDates: any = [...new Set(created_dates.concat(res.data.map((r: any) =>r.resolved_date)))].filter((cd: any) => { if (cd) return cd; }).sort();
          
          // Set chart data for opened and closed
          const opened: any = [];
          const closed: any = []; 
          combinedDates.forEach((cd: any) => {
            opened.push(res.data.filter((r: any) => r.created_at == cd).length);
            closed.push(res.data.filter((r: any) => r.resolved_date == cd).length);
          })

          this.chartOption = {
            xAxis: {
              type: 'category',
              data: combinedDates,
              tooltip: {
                show: true
              },
              axisLabel: {
                formatter: function (value) {
                  return value.split("T")[0];
                }
              }
            },
            yAxis: {
              type: 'value',
            },
            legend: {
              show: true
            },
            series: [
              {
                name: "Closed",
                data: closed,
                type: 'line',
                label: {
                  show: true
                }
              },
              {
                name: "Opened",
                data: opened,
                type: 'line',
                label: {
                  show: true
                }
              },
            ],
          }
        })
    })
  }

  openDialog(data: any, action: string): void {
    // Set the Status Field
    this.adminUser = (action == "edit" && this.userEmail == "mj1737+admin@gmail.com");
    
    if (["create", "edit"].includes(action)) {
      const dialogRef = this.dialog.open(IncidentDialogComponent, {
        height: '600px',
        width: '800px',
        backdropClass: 'backdropBackground',
        data: {
          value: data,
          action: action,
          adminUser: this.adminUser
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Perform the action
          if (result.action == "create") {
            console.log("Create Record", result);
            result.email = this.userEmail;
            this.apiService.createUsersIncident(result)
              .subscribe(_res => {
                window.location.reload();
              })
          } else if (result.action == "edit") {
            console.log("Update Record", result);
            this.apiService.updateUsersIncident(result.id, result)
              .subscribe(_res => {
                window.location.reload();
              })
          }
        }
      });
    } else if (action == "delete") {
      alert(`Are you sure you want to delete Incident #${data.id}`)
      this.apiService.deleteUsersIncident(data.id)
        .subscribe(_res => {
          window.location.reload();
        })
    }
  }
}
