import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  botName = "DigiSaathi";
  greeting: string;
  constructor(private apiservice: ApiService) {
    this.apiservice.changeLangSubject$.subscribe((langCode) => {
      let lang = sessionStorage.getItem("lang")
        ? sessionStorage.getItem("lang")
        : localStorage.getItem("lang")
        ? localStorage.getItem("lang")
        : "en";
      if (lang === "en") {
        this.botName = "DigiSaathi";
      } else if (lang === "hi") {
        this.botName = "डिजिसाथी";
      } else if (lang === "mr") {
        this.botName = "डिजिसाथी";
      } else if (lang === "kn") {
        this.botName = "ಡಿಜಿಸಾಥಿ";
      } else if (lang === "ta") {
        this.botName = "டிஜிசாதி";
      } else if (lang === "bn") {
        this.botName = "ডিজিসাথী";
      } else if (lang === "te") {
        this.botName = "డిజిసాతి";
      } else if (lang === "gu") {
        this.botName = "ડિજીસાથી";
      } else if (lang === "ml") {
        this.botName = "ഡിജിസാത്തി";
      } else if (lang === "pa") {
        this.botName = "ਡਿਜੀਸਾਥੀ";
      }else if (lang === "or") {
        this.botName = "ଡିଜିସାଥୀ";}
      else if (lang === "asm") {
        this.botName = "ডিজিটসাথী";}
    });
    const today: Date = new Date();
    const hour: number = today.getHours();

    if (hour >= 5 && hour < 12) {
      this.greeting = "Morning";
    } else if (hour >= 12 && hour < 18) {
      this.greeting = "Afternoon";
    } else {
      this.greeting = "Evening";
    }
  }

  ngOnInit() {}
}
