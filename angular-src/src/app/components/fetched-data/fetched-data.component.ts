import { Component, OnInit } from '@angular/core';
import { FileTimestampService } from '../../services/file-timestamp.service'
import { FetchedResponse } from 'src/app/models/FetchedResponse';

@Component({
  selector: 'app-fetched-data',
  templateUrl: './fetched-data.component.html',
  styleUrls: ['./fetched-data.component.css']
})
export class FetchedDataComponent implements OnInit {
  message:string = "Please wait...";
  data:FetchedResponse;
  
  constructor(private fileTs:FileTimestampService) { }

  getData(){
    this.fileTs.getMessage().subscribe(data => {
      this.data = data;
      this.message = this.data.message;
    });
  }
  ngOnInit() {
    this.getData();
  }
}
