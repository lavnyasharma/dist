
import { Component, OnInit } from "@angular/core";
import { Chatdata } from "../data/chatbdata";
import { ApiService } from "../services/api.service";
import { SpeechRecognitionService } from "../services/speech-recognition.service";

import * as RecordRTC from "recordrtc";
import DOMPurify from 'dompurify';
import { trigger, state, style, animate, transition } from "@angular/animations";

@Component({
   selector: "app-search-box",
   templateUrl: "./search-box.component.html",
   styleUrls: ["./search-box.component.css"],
   standalone: false,
   animations: [
      trigger("inOutAnimation", [
         transition(":enter", [
            style({ height: 0, opacity: 0 }),
            animate("0.5s ease-out", style({ height: 143, opacity: 1 })),
         ]),
         transition(":leave", [
            style({ height: 143, opacity: 1 }),
            animate("0.5s ease-in", style({ height: 0, opacity: 1 })),
         ]),
      ]),
   ],
})
export class SearchBoxComponent implements OnInit {
   value;
   searchRes;
   isRecording = false;
   private record;
   openSearch = false;
   // private url;
   private urls = [];
   localStem;
   errorText;
   feedback = false;
   public speakflg = false;
   translationConfig = true;
   disableTypeahead = false;

   questions: unknown[];
   micEnable: boolean;
   chromeResult;
   lead = false;

   subSectoreLabel = "Please Select Sub Sector";
   jobRoleLabel = "Please Enter Job Role";
   placeholderLabel = "";
   quitRegistration = "Quit registration?";
   quitRegistration_label = "Changes made so far will not be saved";
   yes = "Yes";
   cancel = "Cancel";
   didMean = "Did you mean ?";
   langCode = "en";
   popLead = false;
   leadVoiceEnable = false;
   showConfirmBox = false;
   skipDisabled = false;
   sendDisabled = false;
   isNotValid = false;
   text = "Type your query here";
   interval = 0;
   skipActivated = false;
   registerLeadBox = false;
   bankAuto;
   bankAutoFirst = true;
   queryAuto;
   bankDetails = false;
   voiceValue;
   responseData;

   constructor(
      private apiservice: ApiService,
      private speechRecognitionService: SpeechRecognitionService,

   ) {
      this.apiservice.autoSuggestion$.subscribe((data) => {
         if (!this.bankDetails) {
            this.questions = data;
            console.log("questions", this.questions);
         }

         this.queryAuto = data;
         if (this.bankAutoFirst) {
            this.apiservice.getBankAuto();
            this.bankAutoFirst = false;
         }
      });

      this.apiservice.getBankAuto().subscribe((data) => {
         this.bankAuto = data;
      });
      this.apiservice.changeLangSubject$.subscribe((langCode) => {
         this.langCode = langCode;
         this.apiservice.getAll();

         if (langCode === "en") {
            this.quitRegistration = "Quit registration?";
            this.didMean = "Did you mean ?";
            this.quitRegistration_label = "Changes made so far will not be saved";
            this.yes = "Yes";
            this.cancel = "Cancel";
            this.text = "Type your query here";
         }else if (langCode === "te") {
            this.quitRegistration = "రిజిస్ట్రేషన్ నుండి నిష్క్రమించాలా?";
            this.didMean = "మీరు చెప్పేది?";
            this.quitRegistration_label = "ఇప్పటివరకు చేసిన మార్పులు సేవ్ చేయబడవు";
            this.yes = "అవును";
            this.cancel = "రద్దు చేయండి";
            this.text = "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి";
         }else if (langCode === "gu") {
            this.quitRegistration = "નોંધણી છોડો?";
            this.didMean = "શું તમારો મતલબ હતો?";
            this.quitRegistration_label = "અત્યાર સુધી કરેલા ફેરફારો સાચવવામાં આવશે નહીં";
            this.yes = "હા";
            this.cancel = "રદ કરો";
            this.text = "તમારો પ્રશ્ન અહીં લખો";
         }
         else if (langCode === "bn") {
            this.didMean = "মানে?";
            this.quitRegistration = "নিবন্ধন বন্ধ?";
            this.quitRegistration_label = "এ পর্যন্ত করা পরিবর্তনগুলি সংরক্ষণ করা হবে না";
            this.yes = "হ্যাঁ";
            this.cancel = "বাতিল করুন";
            this.text = "এখানে আপনার প্রশ্ন টাইপ করুন";
         }else if (langCode === "ta") {
            this.didMean = "நீங்கள் சொன்னீர்களா?";
            this.quitRegistration = "பதிவிலிருந்து வெளியேறவா?";
            this.quitRegistration_label = "இதுவரை செய்த மாற்றங்கள் சேமிக்கப்படாது";
            this.yes = "ஆம்";
            this.cancel = "ரத்து செய்";
            this.text = "உங்கள் வினவலை இங்கே தட்டச்சு செய்யவும்";
         } else if (langCode === "hi") {
            this.didMean = "क्या आपका यह मतलब था?";
            this.quitRegistration = "पंजीकरण से बाहर निकलें?";
            this.quitRegistration_label = "अब तक किए गए परिवर्तन सहेजे नहीं जाएंगे";
            this.yes = "हां";
            this.cancel = "रद्द करें";
            this.text = "अपना प्रश्न यहां लिखे";
         } else if (langCode === "kn") {
            this.didMean = "ನಿಮ್ಮ ಮಾತಿನ ಅರ್ಥವೇ?";
            this.quitRegistration = "ನೋಂದಣಿ ತ್ಯಜಿಸುವುದೇ?";
            this.quitRegistration_label = "ಇಲ್ಲಿಯವರೆಗೆ ಮಾಡಿದ ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಲಾಗುವುದಿಲ್ಲ";
            this.yes = "ಹೌದು";
            this.cancel = "ರದ್ದುಮಾಡು";
            this.text = "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ";
         } else if (langCode === "mr") {
            this.didMean = "तुम्हाला म्हणायचे आहे का?";
            this.quitRegistration = "नोंदणी सोडायची?";
            this.quitRegistration_label = "आतापर्यंत केलेले बदल जतन केले जाणार नाहीत";
            this.yes = "होय";
            this.cancel = "रद्द करा";
            this.text = "तुमची प्रश्न येथे टाइप करा";
         } else if (langCode === "ml") {
            this.didMean = "രജിസ്‌ട്രേഷൻ ഉപേക്ഷിക്കണോ?";
            this.quitRegistration = "നിങ്ങൾ ഉദ്ദേശിച്ചോ ?";
            this.quitRegistration_label = "ഇതുവരെ വരുത്തിയ മാറ്റങ്ങൾ സംരക്ഷിക്കപ്പെടില്ല";
            this.yes = "അതെ";
            this.cancel = "റദ്ദാക്കുക";
            this.text = "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക";
         } else if (langCode === "pa") {
            this.didMean = "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਛੱਡਣੀ ਹੈ?";
            this.quitRegistration = "ਕੀ ਤੁਹਾਡਾ ਮਤਲਬ ਸੀ?";
            this.quitRegistration_label = "ਹੁਣ ਤੱਕ ਕੀਤੀਆਂ ਤਬਦੀਲੀਆਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਕੀਤਾ ਜਾਵੇਗਾ";
            this.yes = "ਹਾਂ";
            this.cancel = "ਰੱਦ ਕਰੋ";
            this.text = "ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਇੱਥੇ ਟਾਈਪ ਕਰੋ";
         }else if (langCode === "or") {
            this.quitRegistration = "ପଞ୍ଜୀକରଣ ଛାଡନ୍ତୁ?";
            this.didMean = "ଆପଣ ଏହାର ଅର୍ଥ କରିଛନ୍ତି କି?";
            this.quitRegistration_label = "ଏପର୍ଯ୍ୟନ୍ତ କରାଯାଇଥିବା ପରିବର୍ତ୍ତନଗୁଡିକ ସଞ୍ଚୟ ହେବ ନାହିଁ";
            this.yes = "ହଁ";
            this.cancel = "ବାତିଲ୍ କରନ୍ତୁ ";
            this.text = "ଏଠାରେ ତୁମର ଜିଜ୍ଞାସା ଟାଇପ୍ କର ";
         }
         else if (langCode === "asm") {
            this.quitRegistration = "পঞ্জীয়ন এৰিব?";
            this.didMean = "আপুনি সেইটোৱেই বুজাব বিচাৰিছিল নেকি?";
            this.quitRegistration_label = "এতিয়ালৈকে কৰা পৰিবৰ্তনসমূহ সংৰক্ষণ কৰা নহ’ব";
            this.yes = "হয়";
            this.cancel = "বাতিল কৰক";
            this.text = "আপোনাৰ প্ৰশ্ন ইয়াত লিখক";
         }
         this.placeholderLabel = "";
         this.type();
      });
      this.apiservice.ReplyToUser$.subscribe((data) => {
         setTimeout(() => {
            if (data.ReplyData.lead || data.ReplyData.leadType) {
               if (data.ReplyData.action_label === "Request Call Back") {
                  this.registerLeadBox = true;
               }

               this.lead = true;
               this.langCode = "en";
               this.responseData = data.ReplyData;
            } else {
               this.lead = false;
               this.responseData = null;
               this.leadVoiceEnable = false;
            }
         }, 1000);

         if (data.ReplyData.isFallback) {
            this.bankDetails = true;
            this.questions = this.bankAuto;
         } else {
            this.bankDetails = false;
            this.questions = this.queryAuto;
         }
         if (
            data.ReplyData.answer == "<p>Let me know your query</p>" ||
            data.ReplyData.answer == "<p>मुझे अपनी प्रश्न बताएं</p>" ||
            data.ReplyData.answer == "<p>मुझे अपना प्रश्न बताएं</p>" ||
            data.ReplyData.answer == "<p>मुझे अपनी सवाल बताएं</p>" ||
            data.ReplyData.answer == "<p>मला तुमचा प्रश्न कळवा</p>" ||
            data.ReplyData.answer == "<p>मला तुमची प्रश्न कळवा</p>" ||
            data.ReplyData.answer == "<p>कृपया मुझे अपना प्रश्न बताएं</p>" ||
            data.ReplyData.answer == "<p>ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನನಗೆ ತಿಳಿಸಿ</p>" ||
            data.ReplyData.answer == "<p>আমাকে আপনার প্রশ্ন জানান</p>" ||
            data.ReplyData.answer == "<p>మీ ప్రశ్నను నాకు తెలియజేయండి</p>" ||
            data.ReplyData.answer == "<p>મને તમારો પ્રશ્ન જણાવો</p>" ||
            data.ReplyData.answer == "<p>મને તમારી ક્વેરી જણાવો</p>" ||
            data.ReplyData.answer == "<p>আমাকে আপনার প্রশ্ন জানতে দিন</p>" ||
            data.ReplyData.answer == "<p>உங்கள் கேள்வியை எனக்குத் தெரியப்படுத்துங்கள்</p>" ||
            data.ReplyData.anser == "<p>મને તમારી ક્વેરી જણાવો</p>" ||
            data.ReplyData.answer == "<p>మీ ప్రశ్నను నాకు తెలియజేయండి</p>" ||
            data.ReplyData.answer == "<p>നിങ്ങളുടെ ചോദ്യം എന്നെ അറിയിക്കൂ</p>" ||
            data.ReplyData.answer == "<p>ਮੈਨੂੰ ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਬਾਰੇ ਦੱਸੋ</p>" || 
            data.ReplyData.answer == "<p>ମୋତେ ଆପଣଙ୍କ କ୍ୱେରି ଜଣାନ୍ତୁ</p>" || 
            data.ReplyData.answer == "<p>আপোনাৰ প্ৰশ্ন মোক জনাওক</p>" ||
            data.ReplyData.answer == "<p>ମୋତେ ତୁମର ଜିଜ୍ଞାସା ଜଣାଇବାକୁ ଦିଅ|</p>" ||
            // data.ReplyData.answer == "<p>আমাৰ লগত আড্ডা দিয়াৰ বাবে ধন্যবাদ। আপোনাৰ মতামত আমাক জনাব</p>" ||
            
            data.ReplyData.isFallback == true
         ) {
            this.openSearch = true;
            console.log("opensearch", this.openSearch);
            this.placeholderLabel = "";
            this.text = "";

            if (data.ReplyData.isFallback == true) {
               if (this.langCode == "en") {
                  this.text = "Type your Bank/Institution name here";
               } else if (this.langCode == "hi") {
                  this.text = "यहां अपने बैंक/संस्थान का नाम टाइप करें";
               } else if (this.langCode == "kn") {
                  this.text = "ನಿಮ್ಮ ಬ್ಯಾಂಕ್/ಸಂಸ್ಥೆಯ ಹೆಸರನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ";
               } else if (this.langCode == "mr") {
                  this.text = "तुमच्या बँकेचे/संस्थेचे नाव येथे टाइप करा";
               }else if (this.langCode == "bn") {
                  this.text = "এখানে আপনার ব্যাঙ্ক/প্রতিষ্ঠানের নাম টাইপ করুন";
               }else if (this.langCode == "ta") {
                  this.text = "உங்கள் வங்கி/நிறுவனத்தின் பெயரை இங்கே தட்டச்சு செய்யவும்";
               }else if (this.langCode == "te") {
                  this.text = "మీ బ్యాంక్/సంస్థ పేరును ఇక్కడ టైప్ చేయండి";
               }else if (this.langCode == "gu") {
                  this.text = "તમારી બેંક/સંસ્થાનું નામ અહીં લખો";
               }else if (this.langCode == "ml") {
                  this.text = "നിങ്ങളുടെ ബാങ്ക്/സ്ഥാപനത്തിന്റെ പേര് ഇവിടെ ടൈപ്പ് ചെയ്യുക";
               }else if (this.langCode == "pa") {
                  this.text = "ਇੱਥੇ ਆਪਣੇ ਬੈਂਕ/ਸੰਸਥਾ ਦਾ ਨਾਮ ਟਾਈਪ ਕਰੋ";
               }else if (this.langCode == "or") {
                  this.text = "ତୁମ ବ୍ୟାଙ୍କ/ଅନୁଷ୍ଠାନର ନାମ ମୋତେ ଜଣାନ୍ତୁ|";
               }else if (this.langCode == "asm") {
                  this.text = "আপোনাৰ বেংক/প্ৰতিষ্ঠানৰ নাম মোক জনাওক";
               }
            } else {
               if (this.langCode == "en") {
                  this.text = "Type your query here";
               } else if (this.langCode == "hi") {
                  this.text = "अपना प्रश्न यहां लिखे";
               } else if (this.langCode == "kn") {
                  this.text = "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ";
               } else if (this.langCode == "mr") {
                  this.text = "तुमची प्रश्न येथे टाइप करा";
               } else if (this.langCode == "bn") {
                  this.text = "এখানে আপনার প্রশ্ন টাইপ করুন";
               } else if (this.langCode == "ta") {
                  this.text = "உங்கள் வினவலை இங்கே தட்டச்சு செய்யவும்";
               } else if (this.langCode == "te") {
                  this.text = "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి";
               } else if (this.langCode == "gu") {
                  this.text = "તમારો પ્રશ્ન અહીં લખો";
               }else if (this.langCode == "ml") {
                  this.text = "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക";
               }else if (this.langCode == "pa") {
                  this.text = "ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਇੱਥੇ ਟਾਈਪ ਕਰੋ";
               }else if (this.langCode == "or") {
                  this.text = "ଏଠାରେ ତୁମର ଜିଜ୍ଞାସା ଟାଇପ୍ କର";
               }else if (this.langCode == "asm") {
                  this.text = "আপোনাৰ প্ৰশ্ন মোক জনাওক";
                  ;
               }
            }
            this.type();
         } else {
            this.openSearch = false;
         }

         if (data.ReplyData.greeting) {
            this.openSearch = true;
            this.placeholderLabel = "";
            if (this.langCode == "en") {
               this.text = "Type your query here";
            } else if (this.langCode == "hi") {
               this.text = "अपना प्रश्न यहां लिखे";
            } else if (this.langCode == "kn") {
               this.text = "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ";
            } else if (this.langCode == "mr") {
               this.text = "तुमची प्रश्न येथे टाइप करा";
            } else if (this.langCode == "ta") {
               this.text = "உங்கள் வினவலை இங்கே தட்டச்சு செய்யவும்";
            } else if (this.langCode == "bn") {
               this.text = "এখানে আপনার প্রশ্ন টাইপ করুন";
            } else if (this.langCode == "te") {
               this.text = "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి";
            } else if (this.langCode == "gu") {
               this.text = "તમારી ક્વેરી અહીં લખો ";
            } else if (this.langCode == "ml") {
               this.text = "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക";
            } else if (this.langCode == "pa") {
               this.text = "ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਇੱਥੇ ਟਾਈਪ ਕਰੋ";
            }else if (this.langCode == "or") {
               this.text = "ଏଠାରେ ତୁମର ଜିଜ୍ଞାସା ଟାଇପ୍ କର";
            }else if (this.langCode == "asm") {
               this.text = "আপোনাৰ প্ৰশ্ন মোক জনাওক";
            }

            this.type();
         }

         if (data.ReplyData.feedback) {
            this.openSearch = true;
            this.placeholderLabel = "";
            if (this.langCode == "en") {
               this.text = "Type here to start again…";
            } else if (this.langCode == "hi") {
               this.text = "फिर से शुरू करने के लिए यहां टाइप करें...";
            } else if (this.langCode == "kn") {
               this.text = "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಲು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...";
            } else if (this.langCode == "mr") {
               this.text = "पुन्हा सुरू करण्यासाठी येथे टाइप करा...";
            }else if (this.langCode == "ta") {
               this.text = "மீண்டும் தொடங்க இங்கே தட்டச்சு செய்யவும்…";
            }else if (this.langCode == "bn") {
               this.text = "আবার শুরু করতে এখানে টাইপ করুন...";
            }else if (this.langCode == "te") {
               this.text = "మళ్లీ ప్రారంభించడానికి ఇక్కడ టైప్ చేయండి…";
            }else if (this.langCode == "gu") {
               this.text = "ફરી શરૂ કરવા માટે અહીં ટાઇપ કરો...";
            }else if (this.langCode == "ml") {
               this.text = "വീണ്ടും ആരംഭിക്കാൻ ഇവിടെ ടൈപ്പ് ചെയ്യുക...";
            }else if (this.langCode == "pa") {
               this.text = "ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਇੱਥੇ ਟਾਈਪ ਕਰੋ...";
            }else if (this.langCode == "or") {
               this.text = "ପୁନର୍ବାର ଆରମ୍ଭ କରିବାକୁ ଏଠାରେ ଟାଇପ୍ କରନ୍ତୁ…";
            }else if (this.langCode == "asm") {
               this.text = " আকৌ আৰম্ভ কৰিবলৈ ইয়াত টাইপ কৰক...";
            }
            this.type();
            this.feedback = true;
         } else {
            this.feedback = false;
         }
      });
   }

   ngOnInit() {
      var userAgent = window.navigator.userAgent;

      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || isSafari) {
         this.micEnable = true;
      } else {
         this.micEnable = true;
      }

      this.apiservice.getAll();
   }

   querySelected(data) {
      if (this.disableTypeahead) {
         return;
      }
      if (data === "" || data === undefined) {
         return;
      }
      if (this.feedback) {
         this.optionSelection("84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1", data, 1);
         return;
      }

      this.apiservice.voiceoff(3);
      this.apiservice.userQuerySend(data, 1, null, 1, null);
      this.value = "";
   }

sendMessage() {
  console.log("Sending message:", this.value);

  // 1️⃣ Sanitize
  const sanitizedValue = DOMPurify.sanitize(this.value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  console.log("Sanitized value:", sanitizedValue);

  // 2️⃣ If empty after sanitize, block it
  if (!sanitizedValue.trim()) {
    console.warn("Blocked invalid or empty input!");
    this.value = ""; // Clear
    return; // 🚫 STOP. Do not proceed.
  }

  // 3️⃣ Valid input: use sanitized value
  this.value = sanitizedValue;

  this.disableTypeahead = true;
  this.apiservice.voiceoff(3);

  // 4️⃣ If feedback mode
  if (this.feedback) {
    this.optionSelection(
      "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
      this.value,
      1
    );
    setTimeout(() => {
      this.disableTypeahead = false;
    }, 1000);
    return; // ✅ STOP here — do not fall through!
  }

  // 5️⃣ Normal message send
  this.apiservice.userQuerySend(this.value, 1, null, 1, null);

  this.value = "";
  this.typeAheadDisable();

  setTimeout(() => {
    this.disableTypeahead = false;
  }, 1000);
}


   activateSpeechSearchMovie(): void {
      let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      this.apiservice.voiceoff(3);
      this.value = "";

      if (isChrome && isMobile == false) {
         this.startRecording();
      }

      if (this.speakflg) {
         this.speakflg = false;
         this.speechRecognitionService.DestroySpeechObject();
         this.translationConfig = true;
      } else {
         this.speakflg = true;
         this.translationConfig = false;
         // setTimeout(() => {
         //   console.log(this.value)
         //   if (this.value == "") {
         //     this.speakflg = false;
         //     this.speechRecognitionService.DestroySpeechObject();
         //     this.translationConfig = true;
         //     alert("no-speech or not-allowed");
         //   }
         // }, 10000);
      }
      this.speechRecognitionService.record(this.langCode).subscribe(
         // listener
         (value) => {
            this.value = value;
            this.chromeResult = value;
            // console.log(value);
            this.speechRecognitionService.DestroySpeechObject();
            this.leadVoiceEnable = true;

            if (this.feedback) {
               this.optionSelection("84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1", this.value, 2);
               return;
            }
            // if (isChrome && isMobile) {
            // this.hit();
            if (
               this.responseData &&
               this.responseData.user_input &&
               (this.responseData.user_input.input_type === "text" ||
                  this.responseData.user_input.input_type === "email" ||
                  this.responseData.user_input.input_type === "number")
            ) {
               if (this.responseData.user_input.input_type === "email") {
                  this.value = this.value.toLowerCase().replace(/\bdot\b/g, ".");
                  this.value = this.value.replace(/\s*at the rate\s* /gi, function (x) {
                     return "@";
                  });
                  this.value = this.value.replace(/ /g, "");
                  // console.log(this.value);
               } else if (this.responseData.user_input.input_type === "number") {
                  this.value = this.value.replace(/ /g, "");
               }

               this.voiceValue = this.value;

               this.leadVoiceEnable = true;

               this.showConfirmBox = true;

               // this.sendLeadMeassage();
            } else {
               if (isChrome && isMobile) {
                  this.apiservice.startTyping(this.value);
                  this.hit();
               } else {
                  this.hit();
                  this.apiservice.startTyping(this.value);
                  setTimeout(() => {
                     this.stopRecording();
                  }, 500);
               }
            }

            // } else {
            //   this.stopRecording();
            // }
            if (!this.showConfirmBox) {
               this.value = "";
            }

            this.speakflg = false;
            this.skipDisabled = false;
            this.sendDisabled = false;
            this.translationConfig = true;
         },
         // errror
         (err) => {
            if (err.error == "no-speech" || err.error === "not-allowed") {
               alert("no-speech or not-allowed");
               // alert("error")
               // console.log("--restarting service--");
               this.speakflg = false;
               this.speechRecognitionService.DestroySpeechObject();
               this.value = "";
               // this.activateSpeechSearchMovie();
            }
         },
         // completion
         () => {
            // this.noValue = false;
            this.hide();
            this.speakflg = false;
            this.speechRecognitionService.DestroySpeechObject();
            // this.activateSpeechSearchMovie();
            this.translationConfig = true;
         }
      );
   }

   startRecording() {
      this.isRecording = true;
      let mediaConstraints = {
         video: false,
         audio: true,
      };
      navigator.mediaDevices
         .getUserMedia(mediaConstraints)
         .then(this.successCallback.bind(this), this.errorCallback.bind(this));
   }

   successCallback(stream) {
      this.localStem = stream;
      var options = {
         mimeType: "audio/mp3",
         numberOfAudioChannels: 1,
      };

      //Start Actuall Recording
      var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
      this.record = new StereoAudioRecorder(stream, options);
      this.record.record();
   }

   stopRecording() {
      this.isRecording = false;

      //   RecordRTC.stopRecording(function() {
      //     var blob = RecordRTC.getBlob(); // it'll NEVER be undefined
      //     console.log(blob)
      // });
      this.localStem.stop();
      this.record.stop(this.processRecording.bind(this));
   }
   // SelectedQuery,mode,blob
   processRecording(blob) {
      var result = this.chromeResult;

      // this.apiservice.voiceCapture(blob, result);
      this.apiservice.setblobData(blob);
      // this.chatbotService.voiceCapture(blob,)
      // console.log(blob)
      this.urls = [];
      this.urls.push(URL.createObjectURL(blob));
   }
   errorCallback(error) {
      // this.error = 'Can not play audio in your browser';
   }

   hide() {
      this.speakflg = false;
   }

   typeAheadDisable() {
      const elements = document.getElementsByClassName("ta-results").item(0);
      const InputSel = document.getElementsByClassName("queryInput").item(0);
      InputSel.addEventListener("focus", this.autosug, true);
      elements.setAttribute("style", "z-index: -1;");
   }

   autosug() {
      setTimeout(() => {
         document.getElementsByClassName("ta-results").item(0).setAttribute("style", "z-index: 0;");
      }, 3000);
   }

   closeLead() {
      // this.popLead = true;
      this.lead = false;
      this.popLead = false;
      // this.apiservice.clearLead();
   }

   hit() {
      this.apiservice.userQuerySend(this.value, 1, null, 2, null);
   }

   skipLead(label) {
      this.value = label;
      this.skipActivated = true;
      this.speechRecognitionService.DestroySpeechObject();
      this.sendLeadMeassage();
   }

   sendLeadMeassage() {
      if (this.value === "" || this.value === undefined) {
         return;
      }

      let fieldName = this.responseData.fieldName;
      let value = this.value;
      let response;

      response = this.sendGeneral();

      if (response) {
         this.apiservice.voiceoff(3);
         if (this.leadVoiceEnable) {
            this.apiservice.userQuerySend(response, 1, null, 2, null);
         } else {
            this.apiservice.userQuerySend(response, 1, null, 1, null);
         }

         this.value = "";
         this.isNotValid = false;
         this.lead = false;
         this.skipActivated = false;
      }
      this.showConfirmBox = false;
   }

   sendGeneral() {
      let payload = this.responseData.payload;
      let response = { value: "", cxpayload: {} };
      let isValid;
      if (this.skipActivated === true) {
         isValid = true;
      } else {
         isValid = this.checkValidation(this.value);
      }

      let valueType = this.responseData.user_input.input_type;
      let validationType = this.responseData.user_input.validtaion;
      if (!isValid) {
         this.changeTextBox();
      }
      if (this.value === "" || this.value === undefined || !isValid) {
         return true;
      }

      for (var i in payload) {
         if (this.skipActivated) {
            payload[i] = "";
         } else if (valueType === "number" && validationType === "phone") {
            payload[i] = parseInt(this.value);
         } else if (valueType === "date") {
            payload[i] = this.value.toISOString();
            this.value = this.value.toISOString().substring(0, 10);
         } else {
            payload[i] = this.value;
         }
      }
      response.value = this.value;
      response.cxpayload = payload;
      return response;
   }

   checkValidation(value) {
      let valueType = this.responseData.user_input.input_type;
      let validationType = this.responseData.user_input.validtaion;

      if (valueType === "text") {
         return true;
      } else if (valueType === "email") {
         const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

         return re.test(String(value).toLowerCase());
      } else if (valueType === "number" && validationType === "phone") {
         const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
         return regex.test(value);
      } else if (valueType === "number" && validationType === "{'maxLimit':6}") {
         const regex = /^\d{6}$/;
         return regex.test(value);
      } else {
         return true;
      }
   }

   changeTextBox() {
      let textMessage = { email: "Invalid" };
      this.isNotValid = true;
   }

   startLead() {
      let payload = { value: "I want to book TestDrive", lead: true };
      this.registerLeadBox = false;
      this.lead = false;
      this.apiservice.userQuerySend(payload, 1, null, 1, null);
   }

   optionSelection(value, label, mode) {
      this.apiservice.userQuerySend(value, 3, label, mode, null);
      this.value = "";
   }

   type() {
      this.placeholderLabel += this.text.charAt(this.placeholderLabel.length);
      if (this.placeholderLabel.length === this.text.length) {
         return;
      }
      setTimeout(() => {
         this.type();
      }, 120);
   }

   clearAutoSuggestion(event) {
      this.value = event.target.value;
      const elements = document.getElementsByClassName("ta-results").item(0);
      if (this.value == "") {
         elements.setAttribute("style", "opacity: -1;");
      } else {
         elements.setAttribute("style", "z-index: 9;");
      }
   }

   selectDropValue(event) {
      this.clearAutoSuggestion(event);
      setTimeout(() => {
         if (event.key == "ArrowUp" || event.key == "ArrowDown") {
            let value = document.getElementsByClassName(
               "ta-item list-group-item ng-star-inserted active"
            );
            this.value = value[0]["innerText"];
            const elements = document
               .getElementsByClassName("ta-item list-group-item ng-star-inserted active")
               .item(0);
            elements.scrollIntoView({
               behavior: "smooth",
               block: "end",
               inline: "nearest",
            });
         }
      }, 200);
   }
}
