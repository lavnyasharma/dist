import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { Observable, Subject, from } from "rxjs";
import { ChatMessages } from "../chat-box/chat-message.modal";
import dayjs from "dayjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private proxyPrefix = "/npciAPI/";
  constructor(private http: HttpClient) {}
  languageCode = "en";
  preveviousContextData: unknown;
  nextContextData: unknown;
  cxStructure;
  leadType;
  answerId;
  isFallback = false;
  setURL;
  blob;
  cxInfo = null;
  voicedCapture = false;
  closed =false;
  // Observable string sources
  private botReplyPassMethodCall = new Subject<unknown>();
  private userQueryPassMethodCall = new Subject<unknown>();
  private modSubject = new Subject<unknown>();
  private changeLangSubject = new Subject<unknown>();
  private autoSuggestionSubject = new Subject<unknown>();
  // Observable string streams
  ReplyToUser$ = this.botReplyPassMethodCall.asObservable();
  changeLangSubject$ = this.changeLangSubject.asObservable();
  userQuery$ = this.userQueryPassMethodCall.asObservable();
  modSubject$ = this.modSubject.asObservable();
  autoSuggestion$ = this.autoSuggestionSubject.asObservable();

  botReply$: Observable<unknown>;

  private botReplySubject = new Subject<unknown>();

  feedBack(payload) {
    payload.userToken = this.getUserToken();
    return this.http.post<unknown[]>(
      this.proxyPrefix + "dashboard/feedback",
      payload
    );
  }

  userQuerySend(query, value, contextLable, mode, voiceURL) {
    if (value === 1) {
      this.userQueryPassMethodCall.next(query);
    } else if (value === 2) {
      this.userQueryPassMethodCall.next("option");
    } else if (value === 3) {
      this.userQueryPassMethodCall.next(contextLable);
    }
    this.modSubject.next(mode);
    let payload = {
      query: query,
      source: navigator.userAgent,
      inputType: "TEXT",
      audioUrl: voiceURL,
      currentPage: this.setURL !== "" ? this.setURL : window.location.href,
      contextLable: contextLable ? contextLable : null,

      userToken: this.getUserToken(),
      conversationToken : this.getConversationToken(),
      cxpayload: null,
      cxInfo: this.cxInfo,
      next_context: null,
    };

    if (query.cxpayload) {
      payload.query = query.value;
      payload.cxpayload = query.cxpayload;
    } else if (query.lead) {
      payload.query = query.value;
    } else {
      payload.query = query;
      payload.cxpayload = null;
    }
    // next_context: next_context ? next_context : null,
    if (mode === 2) {
      payload.inputType = "VOICE";
    } else {
      payload.inputType = "TEXT";
    }

    if (this.preveviousContextData) {
      payload["contextData"] = this.preveviousContextData;
    }
    if (this.nextContextData && (query.lead || this.leadType)) {
      payload["next_context"] = this.nextContextData;
    }

    if (this.cxStructure && (query.lead || this.leadType)) {
      payload["cxStructure"] = this.cxStructure;
    }

    if (this.isFallback) {
      payload["isFallback"] = true;
    }
    if (value === 1) {
      this.userQueryPassMethodCall.next(payload.query);
    } else if (value === 2) {
      this.userQueryPassMethodCall.next("option");
    }
    this.http
      .post<unknown[]>(
        this.proxyPrefix + "bot/sendQuery/" + this.languageCode,
        payload
      )
      .subscribe(
        (data: unknown) => {
          if (mode === 2 && this.voicedCapture) {
            this.answerId = data.answerId;

            this.voiceCapture(this.blob, data.answerId);
          }

          const response = {
            ReplyData: data,
            status: 200,
            mode: "text",
          };

          if (data.isFallback) {
            this.isFallback = true;
          } else {
            this.isFallback = false;
          }
          if (data.lead || data.leadType) {
            this.nextContextData = data.next_context;
            this.cxStructure = data.cxStructure;
          } else {
            this.nextContextData = null;
            this.cxStructure = null;
          }
          if (data.userToken && this.isSupported()) {
            this.setUserToken(data.userToken);
          }
          if (data.conversationToken && this.isSupported()){
            this.setConversationToken(data.conversationToken)
          }

          if (data.cxInfo) {
            this.cxInfo = data.cxInfo;
          } else {
            this.cxInfo = null;
          }

          if (data.leadType) {
            this.leadType = data.leadType;
          } else {
            this.leadType = null;
          }

          if (data.contextData) {
            this.preveviousContextData = data.contextData;
          } else {
            this.preveviousContextData = null;
          }

          this.botReplyPassMethodCall.next(response);
        },
        (error) => {
          // if (error.status == 404) {
          this.answerId = "";

          if (this.languageCode == "en") {
            const response = {
              ReplyData:
                "Sorry, I couldn't answer this question. You may please contact your bank or institution. Alternatively, you can visit our website digisaathi.info or WhatsApp us your query at 892 891 3333. Thank you.",
              status: 404,
              mode: "text",
              audio:
                "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733311619222_4c8cb752-fb79-4e59-9cdc-b367a6d4f12d.wav",
            };
            this.botReplyPassMethodCall.next(response);
          } else if (this.languageCode == "hi") {
            const response = {
              ReplyData:
                "क्षमा करें, मैं इस प्रश्न का उत्तर नहीं दे सका। आप कृपया अपने बैंक या संस्थान से संपर्क कर सकते हैं। वैकल्पिक रूप से, आप हमारी वेबसाइट digisaathi.info पर जा सकते हैं या हमें 892 891 3333 पर अपना प्रश्न व्हाट्सएप कर सकते हैं। धन्यवाद।",
              status: 404,
              mode: "text",
              audio:
                "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733312280138_e9108538-a5e8-4d69-b7b8-c0c78b7650e0.wav",
            };
            this.botReplyPassMethodCall.next(response);
          } else if (this.languageCode == "kn") {
            const response = {
              ReplyData:
                "ಕ್ಷಮಿಸಿ, ಈ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಲು ನನಗೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಅಥವಾ ಸಂಸ್ಥೆಯನ್ನು ನೀವು ಸಂಪರ್ಕಿಸಬಹುದು. ಪರ್ಯಾಯವಾಗಿ, ನೀವು ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಬಹುದು digisaathi.info ಅಥವಾ 892 891 3333 ರಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮಗೆ WhatsApp ಮಾಡಿ. ಧನ್ಯವಾದಗಳು.",
              status: 404,
              mode: "text",
              audio:
                "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733312749261_076f3d33-acfe-4aea-9dc3-ae988f6357db.wav",
            };
            this.botReplyPassMethodCall.next(response);
          } else if (this.languageCode == "mr") {
            const response = {
              ReplyData:
                "क्षमस्व, मी या प्रश्नाचे उत्तर देऊ शकलो नाही. तुम्ही कृपया तुमच्या बँकेशी किंवा संस्थेशी संपर्क साधू शकता. वैकल्पिकरित्या, तुम्ही आमच्या वेबसाइट digisaathi.info ला भेट देऊ शकता किंवा आम्हाला तुमची क्वेरी 892 891 3333 वर WhatsApp करू शकता. धन्यवाद.",
              status: 404,
              mode: "text",
              audio:
                "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733312581872_a0790592-5908-4632-89f2-3a6ffcd05bf7.wav",
            }
          } else if (this.languageCode == "or") {
              const response = {
                ReplyData:
                  "ଦୁ Sorry ଖିତ, ମୁଁ ଏହି ପ୍ରଶ୍ନର ଉତ୍ତର ଦେଇ ପାରିଲି ନାହିଁ | ଆପଣ ଦୟାକରି ଆପଣଙ୍କର ବ୍ୟାଙ୍କ କିମ୍ବା ଅନୁଷ୍ଠାନ ସହିତ ଯୋଗାଯୋଗ କରିପାରିବେ | ବ ly କଳ୍ପିକ ଭାବରେ, ଆପଣ ଆମର ୱେବସାଇଟ୍ digisaathi.info କିମ୍ବା ହ୍ ats ାଟସ୍ ଆପ୍ 892 891 3333 ରେ ଆପଣଙ୍କର ଜିଜ୍ଞାସା ପରିଦର୍ଶନ କରିପାରିବେ | ଧନ୍ୟବାଦ |",
                status: 404,
                mode: "text",
                audio:
                  "https://storage.googleapis.com/azure-blob-bucket/selfonboard-res/cc0b1f25-85af-4618-9feb-19f110307581.wav",
              };
            this.botReplyPassMethodCall.next(response);
          } else if (this.languageCode == "asm") {
            const response = {
              ReplyData:
                "ক্ষমা কৰিব, এই প্ৰশ্নৰ উত্তৰ দিব নোৱাৰিলোঁ। আপুনি আপোনাৰ বেংক বা প্ৰতিষ্ঠানৰ সৈতে যোগাযোগ কৰিব পাৰে। নতুবা আমাৰ ৱেবছাইট digisaathi.info বা WhatsApp আমাক আপোনাৰ প্ৰশ্ন 892 891 3333 নম্বৰত চাব পাৰে।ধন্যবাদ।",
              status: 404,
              mode: "text",
              audio:
                "https://storage.googleapis.com/azure-blob-bucket/selfonboard-res/27dcc21d-7bb3-4efd-94f0-50e948c1bdb3.wav",
            };
          this.botReplyPassMethodCall.next(response);
        }else if (this.languageCode == "bn") {
          const response = {
            ReplyData:
              "দুঃখিত, আমি এই প্রশ্নের উত্তর দিতে পারিনি। আপনি আপনার ব্যাঙ্ক বা প্রতিষ্ঠানের সাথে যোগাযোগ করতে পারেন. বিকল্পভাবে, আপনি আমাদের ওয়েবসাইট digisaathi.info ভিজিট করতে পারেন বা 892 891 3333 নম্বরে আপনার প্রশ্ন আমাদের WhatsApp করতে পারেন। ধন্যবাদ।",
            status: 404,
            mode: "text",
            audio:
              "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733313064207_df124374-4b6b-4837-8a0e-9d7f37edc23a.wav",
          };
        this.botReplyPassMethodCall.next(response);
      }else if (this.languageCode == "gu") {
        const response = {
          ReplyData:
            "માફ કરશો, હું આ પ્રશ્નનો જવાબ આપી શક્યો નથી. તમે કૃપા કરીને તમારી બેંક અથવા સંસ્થાનો સંપર્ક કરી શકો છો. વૈકલ્પિક રીતે, તમે અમારી વેબસાઇટ digisaathi.info ની મુલાકાત લઈ શકો છો અથવા 892 891 3333 પર તમારી ક્વેરી અમને WhatsApp કરી શકો છો. આભાર.",
          status: 404,
          mode: "text",
          audio:
            "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733312645860_d376fe5c-03b6-434c-9e1b-8e96ada591fb.wav",
        };
      this.botReplyPassMethodCall.next(response);
    }else if (this.languageCode == "te") {
      const response = {
        ReplyData:
          "క్షమించండి, నేను ఈ ప్రశ్నకు సమాధానం చెప్పలేకపోయాను. మీరు దయచేసి మీ బ్యాంక్ లేదా సంస్థను సంప్రదించవచ్చు. ప్రత్యామ్నాయంగా, మీరు మా వెబ్‌సైట్ digisaathi.infoని సందర్శించవచ్చు లేదా 892 891 3333లో మీ ప్రశ్నను మాకు వాట్సాప్ చేయవచ్చు. ధన్యవాదాలు.",
        status: 404,
        mode: "text",
        audio:
          "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733312453014_c1ecd631-1ea9-4543-8c72-b8130261afa5.wav",
      };
    this.botReplyPassMethodCall.next(response);
  }else if (this.languageCode == "ta") {
    const response = {
      ReplyData:
        "மன்னிக்கவும், இந்தக் கேள்விக்கு என்னால் பதிலளிக்க முடியவில்லை. உங்கள் வங்கி அல்லது நிறுவனத்தை நீங்கள் தொடர்பு கொள்ளலாம். மாற்றாக, நீங்கள் எங்கள் வலைத்தளமான digisaathi.info ஐப் பார்வையிடலாம் அல்லது 892 891 3333 என்ற எண்ணில் உங்கள் வினவலை எங்களுக்கு வாட்ஸ்அப் செய்யலாம். நன்றி.",
      status: 404,
      mode: "text",
      audio:
        "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733312509289_5390af2d-3b47-4178-a352-acbb316fbca0.wav",
    };
  this.botReplyPassMethodCall.next(response);
}else if (this.languageCode == "pa") {
  const response = {
    ReplyData:
      "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਇਸ ਸਵਾਲ ਦਾ ਜਵਾਬ ਨਹੀਂ ਦੇ ਸਕਿਆ। ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਬੈਂਕ ਜਾਂ ਸੰਸਥਾ ਨਾਲ ਸੰਪਰਕ ਕਰ ਸਕਦੇ ਹੋ। ਵਿਕਲਪਕ ਤੌਰ 'ਤੇ, ਤੁਸੀਂ ਸਾਡੀ ਵੈੱਬਸਾਈਟ digisaathi.info 'ਤੇ ਜਾ ਸਕਦੇ ਹੋ ਜਾਂ ਸਾਨੂੰ 892 891 3333 'ਤੇ ਆਪਣੀ ਪੁੱਛਗਿੱਛ WhatsApp ਕਰ ਸਕਦੇ ਹੋ। ਧੰਨਵਾਦ।",
    status: 404,
    mode: "text",
    audio:
      "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733312386654_e01a5af9-c7b6-402c-85e4-7b91f9c03107.wav",
  };
this.botReplyPassMethodCall.next(response);
}else if (this.languageCode == "ml") {
  const response = {
    ReplyData:
      "ക്ഷമിക്കണം, എനിക്ക് ഈ ചോദ്യത്തിന് ഉത്തരം നൽകാൻ കഴിഞ്ഞില്ല. നിങ്ങൾക്ക് നിങ്ങളുടെ ബാങ്കുമായോ സ്ഥാപനവുമായോ ബന്ധപ്പെടാം. പകരമായി, നിങ്ങൾക്ക് ഞങ്ങളുടെ വെബ്‌സൈറ്റ് digisaathi.info സന്ദർശിക്കുകയോ 892 891 3333 എന്ന നമ്പറിൽ നിങ്ങളുടെ സംശയം ഞങ്ങൾക്ക് WhatsApp ചെയ്യുകയോ ചെയ്യാം. നന്ദി.",
    status: 404,
    mode: "text",
    audio:
      "https://storage.googleapis.com/azure-blob-bucket/tts/speech_1733312330456_826df21d-d394-4aeb-a5dd-cd118c42f420.wav",
  };
this.botReplyPassMethodCall.next(response);
}
        }
        // }
      );
  }

  changeLang(langCode) {
    this.languageCode = langCode;
    this.changeLangSubject.next(langCode);
  }
  getAll() {
    this.http
      .get<unknown[]>(this.proxyPrefix + "bot/questions/" + this.languageCode)
      .subscribe(
        (data: unknown) => {
          this.autoSuggestionSubject.next(data);
        },
        (error) => {
          // alert(error)
          // this.userQuerySend(result, 1, null, 2, null);
          console.log("oops", error);
        }
      );
  }

  getCategorySuggestion(label) {
    let payload = {
      category: label,
    };
    this.http
      .post<unknown[]>(
        this.proxyPrefix + "bot/questionsbycategory/" + this.languageCode,
        payload
      )
      .subscribe(
        (data: any) => {
          this.autoSuggestionSubject.next(data);
        },
        (error) => {
          // alert(error)
          // this.userQuerySend(result, 1, null, 2, null);
          console.log("oops", error);
        }
      );
  }

  voiceoff(mode) {
    this.modSubject.next(mode);
    // this.voiceoffsys.next();
  }

  public errormsgshow(data) {}

  startTyping(query) {
    this.userQueryPassMethodCall.next(query);
  }

  setblobData(blob) {
    this.voicedCapture = true;
    this.blob = blob;
  }

  voiceCapture(blob, answerId) {
    var formData = new FormData();
    formData.append("uploadFile", blob);

    this.http
      .post<unknown[]>("/voiceAPI/training/speechtotext/" + this.languageCode, formData)
      .subscribe(
        (data: any) => {
          // alert(data.text)
          if (data.audioUrl !== null) {
            // console.log(answerId);
            this.sendVoiceCaptureRequest(data.audioUrl, answerId);
            // this.userQuerySend(result, 1, null, 2, data.audioUrl);
          }
        },
        (error) => {
          // alert(error)
          // this.userQuerySend(result, 1, null, 2, null);
          console.log("oops", error);
        }
      );
  }

  sendVoiceCaptureRequest(audioURL, answerid) {
    this.voicedCapture = false;
    let payload = {
      answerId: answerid,
      audioUrl: audioURL,
    };

    this.http
      .post<unknown[]>("/npciAPI/dashboard/audiocapture", payload)
      .subscribe(
        (data: any) => {
          // console.log("captured");
        },
        (error) => {
          // alert(error)

          console.log("oops", error);
        }
      );
  }
  isSupported() {
    try {
      const key = "__checker__";
      sessionStorage.setItem(key, key);
      sessionStorage.removeItem(key);

      return true;
    } catch (e) {
      return false;
    }
  }

setUserToken(userToken) {
  const expires = dayjs().add(15, "minute").format("YYYY-MM-DDTHH:mm:ss");
  const sessionObject = {
    expiresAt: expires,
    userToken: userToken,
  };
  sessionStorage.setItem("userToken", JSON.stringify(sessionObject));
}

  getUserToken() {
    let userToken = JSON.parse(sessionStorage.getItem("userToken"));

    if (userToken && this.isNotExpired(userToken)) {
      // console.log(true);
      this.setUserToken(userToken.userToken);
      return userToken.userToken;
    } else {
      return null;
    }
  }

isNotExpired(data) {
  return dayjs(data.expiresAt, "YYYY-MM-DDTHH:mm:ss").isAfter(dayjs());
}


  // isconversationExpired(data) {
  //   // window.addEventListener("message",e => { this.closed=true;})
  //   if (moment(data.expiresAt, "YYYY-MM-DDTHH:mm:ss") >= moment() ) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }
setConversationToken(conversationToken) {
  const expires = dayjs().add(15, "minute").format("YYYY-MM-DDTHH:mm:ss");
  const sessionObject = {
    expiresAt: expires,
    conversationToken: conversationToken,
  };
  sessionStorage.setItem("conversationToken", JSON.stringify(sessionObject));
}

  getConversationToken() {
    let conversationToken = JSON.parse(sessionStorage.getItem("conversationToken"));

    if (conversationToken && this.isNotExpired(conversationToken)) {
      // console.log(true);
      this.setConversationToken(conversationToken.conversationToken);
      return conversationToken.conversationToken;
    } else {
      return null;
    }
  }

  setUrl(data) {
    this.setURL = data.sourceUrl;
  }

  getBankAuto() {
    return this.http.get("/npciAPI/bot/bankname");
  }

  deviceType() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const deviceType = isMobile ? "mobile" : "desktop";
    return deviceType;
  }

tracker(value) {
  let headers = {
    appId: '8f1a9ebe-7ce5-4c3e-bf3b-18669e4897e3',
    "Content-Type": 'application/json',
  };
  let payload = {
    userToken: this.getUserToken(),
    eventType: value,
    deviceType: this.deviceType(),
    source: "Chatbot",
  };
  return this.http.post('/npciAPI/dashboard/clickedlist', payload, {
    headers: headers,
  }).pipe(
    tap((data: unknown) => {
      if (data.userToken) {
        let p = {
          expiresAt: dayjs().add(15, "minute").format("YYYY-MM-DDTHH:mm:ss"),
          userToken: data.userToken,
        };
        sessionStorage.setItem('userToken', JSON.stringify(p));
      }
    })
  );
}

}
