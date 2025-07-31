import { Injectable }     from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable({
  providedIn: 'root'
})
export class ChatbotConfig {

  constructor(private http: HttpClient) { 
    
  }
  ngOnInit(){
    // this.http.get("../../assets/config.json").subscribe(data =>{
    //   console.log(data);
    // })
  }
  
}
