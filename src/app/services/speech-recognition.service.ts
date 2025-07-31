import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from "lodash";

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

@Injectable()
export class SpeechRecognitionService {
    speechRecognition: any;

    constructor(private zone: NgZone) {
    }

    record(langSel): Observable<string> {
        return Observable.create(observer => {
            const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
            this.speechRecognition = new webkitSpeechRecognition();
            this.speechRecognition.continuous = true;
            //this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = langSel;
            this.speechRecognition.maxAlternatives = 1;

            this.speechRecognition.onresult = speech => this.zone.run( () => observer.next(speech.results.item(speech.results.length -1).item(0).transcript));

            // this.speechRecognition.onresult = speech => {
            //     let term: string = "";
            //     if (speech.results) {
            //         var result = speech.results[speech.resultIndex];
            //         var transcript = result[0].transcript;
            //         if (result.isFinal) {
            //             if (result[0].confidence < 0.3) {
            //                 console.log("Unrecognized result - Please try again");
            //             }
            //             else {
            //                 term = _.trim(transcript);
            //                 console.log("Did you said? -> " + term + " , If not then say something else...");
            //             }
            //         }
            //     }
            //     this.zone.run(() => {
            //         observer.next(term);
            //     });
            // };
            this.speechRecognition.onerror = error => {
                observer.error(error);
            };
            // recognition.onend = () => observer.complete();
            this.speechRecognition.onend = () => {
                observer.complete();
            };

            this.speechRecognition.start();
            // console.log("Say something - We are listening !!!");
        });
    }

    DestroySpeechObject() {
        if (this.speechRecognition)
            this.speechRecognition.stop();
    }

}