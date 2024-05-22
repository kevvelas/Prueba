import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: `
    .file-upload-button {
      height: 2rem;
      overflow: hidden;
      position: relative;
      width: 2rem;

      input[type="file"] {
          font-size: 100px;
          left: 0;
          opacity: 0;
          position: absolute;
          top: 0;
      }
    }
  `
})
export class AppComponent {
  filterText: string = '';
  result: string = '';
  data: any[] = [];
  filteredData: any[] = [];

  constructor() {
    this.loadLocalStorage();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.result = reader.result as string;
      this.saveLocalStorage();
      this.processFileContent(this.result);
    };

    reader.readAsText(file, 'ISO-8859-1');
  }

  processFileContent(content: string) {
    const rows = content.split('\n');
    this.data = [];

    rows.forEach(row => {
      if (row.trim() !== '') {
        const columns = row.split(';');
        if (columns.length === 6) {
          const obj = {
            tipoDoc: columns[0].trim(),
            numeroDoc: columns[1].trim(),
            nombreSap: columns[2].trim(),
            nombreInvitacion: columns[3].trim(),
            tipo: columns[4].trim(),
            mesa: parseInt(columns[5].trim())
          };

          this.filteredData = this.data;
          this.data.push(obj);
        } else {
          console.error('La línea no tiene el formato esperado:', row);
        }
      }
    });
  }

  filterData() {
    this.filteredData = this.data.filter(item =>
      Object.values(item).some((val:any) =>
        val.toString().toLowerCase().includes(this.filterText.toLowerCase())
      )
    );
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history_data', this.result);
  }

  private loadLocalStorage(): void {
    if(!localStorage.getItem('history_data')) return;
    this.result = localStorage.getItem('history_data')!;
    if(this.result.length === 0) return;
    this.processFileContent(this.result);
  }
}
