
import { Component, ChangeDetectorRef, ViewChild, OnInit, HostListener } from "@angular/core";
import { Chatdata } from "../data/chatbdata";
import { ApiService } from "../services/api.service";
import { interval } from "rxjs";
import { ScrollToBottomDirective } from "../directives/scroll-to-bottom.directive";
import MiniSearch from "minisearch";
import { data } from "../../assets/language_Database";
import { NzCarouselModule } from "ng-zorro-antd/carousel";
import { Trending } from "../data/chatbdata";


@Component({
  selector: "app-chat-box",
  templateUrl: "./chat-box.component.html",
  styleUrls: ["./chat-box.component.css"],
  standalone: false,
})
export class ChatBoxComponent implements OnInit {
  @ViewChild(ScrollToBottomDirective, { static: false })
  scroll: ScrollToBottomDirective;
  public showfeedback;
  public langData = data;
  cookie = true;
  public feedmintext;
  public payload: any;
  public feedflg = false;
  isSubmitted = false;
  public Disflg = false;
  public valiflg = false;
  public bharatGPT =false;
  isDropdownOpen = false;
  public refreshBtn: boolean = false;
  QueryMode;
  autoplayEnabled: boolean = false;

  trendingData = Trending;

  stopListening: Function;
  public badSenFlag = false;
  public Feedbk = "";
  autoriseBotToggle = false;
  public feedDisflg = false;
  activeInterval = 150000;
  inactive_widget = false;
  nextMessageBank = false;
  languageSelect = false;
  langHeader = "Please select your language.";
  selectedCategory = {
    label: "",
    value: "",
  };
  public slideConfig = {
    // slidesToShow: this.userAgentdeveice ? 1.3 : 1.5,
    slidesToShow: 1.5,
    slidesToScroll: 1,
    dots: false,
    infinite: false,
  };
  welcomeOne = false;
  welcomeTwo = false;
  welcomeThree = false;
  welcomeFour = false;
  welcomeFive = false;
  audioSupport = false;

  widgetHeader = "You are Inactive!";
  widgetDescription =
    "Please let us know if you want to continue this conversation…";
  widgetYes = "Yes";
  widgetNo = "No";
  widgetInterval;
  widgetIntervalCount = 0;

  trendingOptions;
  userAgentdeveice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  public feedbackoptions = false;
  spkrplay = true;
  spkrStop = false;
  // @ViewChild('scrollMe',{static: false}) private myScrollContainer: ElementRef;
  public conversations = [];
  timeSpend = new Date(0, 0, 0);
  public typing: boolean;
  public totalVisit: number;
  public totalQuery: number = 0;
  public sessonQuery: number = 0;
  public userQuery: any;
  isMa = false;
  voiceSrc;
  myvoice;
  restItems;
  listOfPosition = ["english", "hindi", "marathi", "kannada"];
  public dtm: any = new Date();
  scrolltop: number = null;
  public langList = [
    { short: "en", full: "English" },
    { short: "hi", full: "Hindi (हिंदी)" },
    { short: "mr", full: "Marathi (मराठी)" },
    { short: "kn", full: "Kannada (ಕನ್ನಡ)" },
    { short: "ta", full: "Tamil (தமிழ்)" },
    { short: "bn", full: "Bengali (বাংলা)" },
    { short: "te", full: "Telugu (తెలుగు)" },
    { short: "gu", full: "Gujarati (ગુજરાતી)" },
    { short: "ml", full: "Malayalam (മലയാളം)" },
    { short: "pa", full: "Punjabi (ਪੰਜਾਬੀ)" },
    { short: "or", full: "Odia (ଓଡ଼ିଆ)" },
    { short: "asm", full: "Assamese (অসমীয়া)" },
  ];
  public chosenLang: string = "en";
  languageSet = "English";
  comment = "Feedback/Suggestions";
  languageCode = "en";
  alsoTry = "Also try";
  chat4 = "Thank you 😃 for submitting your feedback.";
  chat3 =
    "Please do not share any personal information like Name, PAN, Phone Number, Aadhaar Number, UPI PIN, Card Number, Account Number, Password, PIN, OTP, Transaction Details etc. while asking your query.";
  chat2 =
    "I am your Digital Assistant.<br><br> I am here to help you to get information on Digital Payment Products & Services. ";
  chat1 = "Hello👋 <br> <b>DigiSaathi</b> welcomes you!";
  optionMessage = "Select one of the option below:";
  trendingMessage = "Trending Questions:";
  feedback = "Feedback";
  feedInfo = "**Please provide your feedback";
  DisDetails = "**Please provide some more details";
  enterFeed = "Please share your feedback. It will help us to improve";
  submitt = "Submit";
  cancel = "Cancel";
  feedtext = "How was your conversation experience with us?";
  feedtext2 = "Your feedback will help us serve you better";

  confirm =
    "Please confirm to continue with this conversation and avail the information.";
  continue = "Continue";
  abort = "Abort";
  deadline = Date.now() + 1000;

  constructor(
    private apiservice: ApiService,
    private cdref: ChangeDetectorRef // private renderer: Renderer2
  ) {
    this.apiservice.autoSuggestion$.subscribe((data) => {
      this.restItems = data;
    });

    // this.stopListening = renderer.listen(
    //    'window',
    //    'message',
    //    this.handleMessage.bind(this)
    // );

    this.scrollToBottom();
    this.apiservice.userQuery$.subscribe((data) => { 
      this.stopVideo()
      // if(this.autoplayEnabled){
        // this.stopVideo()
      // }     
      if (data == "typing") {
        this.typing = true;
        return;
      }
      this.voiceSrc = null;
      this.scrollToBottom();
      this.typing = true;
      const comment = Array.from(
        document.getElementsByClassName("comment") as HTMLCollectionOf<
          HTMLElement
        >
      );
      if (comment != null) {
        comment.forEach((feed) => (feed.style.display = "none"));
      }
      this.feedbackoptions = false;
      if (data !== "option") {
        this.userQuery = data;
      }
    });

    this.apiservice.ReplyToUser$.subscribe((data) => {
      this.stopVideo()
      this.isSubmitted = true;
      this.feedbackoptions = false;
      clearInterval(this.widgetInterval);
      this.widgetInterval = setInterval(() => {
        if (this.widgetIntervalCount > 6) {
          clearInterval(this.widgetInterval);
          return;
        }
        this.inactive_widget = true;

        setTimeout(() => {
          this.inactive_widget = false;
          this.widgetIntervalCount++;
        }, 30000);
      }, this.activeInterval);

      const conversation: any = {};
      let messageStepsFlow: any = {};
      if (data.status == 200) {
        // console.log(data.ReplyData);
        if (data.ReplyData.answer.length > 1) {
          messageStepsFlow.required = true;
          messageStepsFlow.message = data.ReplyData.answer;
        } else {
          messageStepsFlow = false;
        }
        if (
          data.ReplyData.label ==
          "क्रेडीट कार्डवर कोणते महत्त्वाचे शुल्क लागू आहे?"
        ) {
          this.isMa = true;
        }
        conversation.option = this.checkOptions(data.ReplyData);
        conversation.optionMessage = this.getOptionMessage(
          data.ReplyData.answer
        );
        if (conversation.option == false) {
          if (data.ReplyData.answer && data.ReplyData.answer != "") {
            if (
              !data.ReplyData.answer.includes(
                "Do you have any more questions?"
              ) &&
              data.ReplyData.answer !==
                "<p><strong>Select one of the options below</strong></p>" &&
              data.ReplyData.answer !==
                "<p><strong>Please select your query</strong></p>" &&
              data.ReplyData.answer !== "<p>Let me know your query</p>" &&
              data.ReplyData.answer !== "<p>मुझे अपनी सवाल बताएं</p>" &&
              data.ReplyData.answer !== "<p>कृपया मुझे अपना प्रश्न बताएं</p>" &&
              data.ReplyData.answer !== "<p>আমাকে আপনার প্রশ্ন জানান</p>" &&
              data.ReplyData.answer !== "<p>আমাকে আপনার প্রশ্ন জানতে দিন</p>" &&
              data.ReplyData.answer !==
                "<p>உங்கள் கேள்வியை எனக்குத் தெரியப்படுத்துங்கள்</p>" &&
              data.ReplyData.answer !== "<p>મને તમારી ક્વેરી જણાવો</p>" &&
              data.ReplyData.answer !== "<p>మీ ప్రశ్నను నాకు తెలియజేయండి</p>" &&
              data.ReplyData.answer !=
                "<p><strong>ചുവടെയുള്ള ഓപ്ഷനുകളിലൊന്ന് തിരഞ്ഞെടുക്കുക</strong></p>" &&
              data.ReplyData.anser !==
                "<p><strong>ചുവടെയുള്ള ഓപ്ഷനുകളിലൊന്ന് തിരഞ്ഞെടുക്കുക</strong></p>" &&
              data.ReplyData.anser !==
                "<p><strong>ദയവായി നിങ്ങളുടെ അന്വേഷണം തിരഞ്ഞെടുക്കുക</strong></p>" &&
              data.ReplyData.answer !==
                "<p>നിങ്ങളുടെ ചോദ്യം എന്നെ അറിയിക്കൂ</p>" &&
              data.ReplyData.answer !==
                "<p><strong>ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਇੱਕ ਚੁਣੋ</strong></p>" &&
              data.ReplyData.answer !==
                "<p><strong>ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਚੁਣੋ</strong></p>" &&
              data.ReplyData.answer !==
                "<p>ਮੈਨੂੰ ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਬਾਰੇ ਦੱਸੋ</p>" &&
              "<p><strong>सम्पर्क करने के लिये आपको धन्यवाद। तुमसे जल्द मिलने की आशा करता हूँ।</strong></p>" &&
              data.ReplyData.answer !==
                "<p><strong>ମୋତେ ଆପଣଙ୍କ କ୍ୱେରି ଜଣାନ୍ତୁ</p>" &&

              // ASM and OR
              data.ReplyData.answer !==
                "<p><strong>যোগাযোগ কৰাৰ বাবে ধন্যবাদ। আশা কৰিছো সোনকালে লগ পাম।</strong></p>" && 
              data.ReplyData.answer !==
                "<p><strong>ଯୋଗାଯୋଗ ପାଇଁ ଧନ୍ୟବାଦ| ଶୀଘ୍ର ତୁମକୁ ଭେଟିବାକୁ ଆଶା କରୁଛି|</strong></p>" && 
              
              data.ReplyData.answer !==
                "<p><strong>Thank you for contacting. Hope to meet you soon.</strong></p>" && 

              

                // // Assamese & Odia:
                // data.ReplyData.answer !==
                // "<p>ମୋତେ ତୁମର ଜିଜ୍ଞାସା ଜଣାଇବାକୁ ଦିଅ|</p>"  &&
                // data.ReplyData.answer !==
                // "<p>যোগাযোগ কৰাৰ বাবে ধন্যবাদ। আশা কৰিছো সোনকালে লগ পাম।</p>"    &&

              !data.ReplyData.answer.includes(
                "ನೀವು ಯಾವುದೇ ಹೆಚ್ಚಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಹೊಂದಿದ್ದೀರಾ?"
              ) &&
              data.ReplyData.answer !==
                "<p><strong>ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ</strong></p>" &&
              data.ReplyData.answer !==
                "<p><strong>ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</strong></p>" &&
              data.ReplyData.answer !==
                "<p>ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನನಗೆ ತಿಳಿಸಿ</p>" &&
              !data.ReplyData.answer.includes(
                "तुम्हाला आणखी काही प्रश्न आहेत का?"
              ) &&
              !data.ReplyData.answer.includes(
                "क्या आपके पास और कोई सवाल हैं?"
              ) &&
              data.ReplyData.answer !==
                "<p><strong>खालील पर्यायांपैकी एक निवडा</strong></p>" &&
              data.ReplyData.answer !==
                "<p><strong>कृपया तुमची प्रश्न निवडा</strong></p>" &&
              data.ReplyData.answer !== "<p>मला तुमचा प्रश्न कळवा</p>" &&
              data.ReplyData.answer !== "<p>मला तुमची प्रश्न कळवा</p>" &&
              data.ReplyData.isFallback !== true &&
              data.ReplyData.feedback !== true &&
              data.ReplyData.greeting !== true &&
              data.ReplyData.answer !== "<p>मुझे अपनी प्रश्न बताएं</p>" &&
              data.ReplyData.answer !== "<p>कृपया मुझे अपना प्रश्न बताएं</p>" &&
              data.ReplyData.answer !==
                "<p><strong>ಸಂಪರ್ಕಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಲು ಆಶಿಸುತ್ತೇನೆ.</strong></p>" &&
              data.ReplyData.answer !==
                "<p><strong>संपर्क केल्याबद्दल धन्यवाद. लवकरच भेटू अशी आशा आहे.</strong></p>" &&
              data.ReplyData.answer !==
                "<p>നിങ്ങളുടെ ചോദ്യം എന്നെ അറിയിക്കൂ</p>" 
                // // Assamese and Oria
                // &&
                // data.ReplyData.answer !==
                // "<p>ମୋତେ ତୁମର ଜିଜ୍ଞାସା ଜଣାଇବାକୁ ଦିଅ|</p>"  &&
                // data.ReplyData.answer !==
                // "<p>আপোনাৰ প্ৰশ্ন মোক জনাওক</p>"                
                  
            ) {
              // console.log(this.selectedCategory.value);
              if (this.languageCode == "en") {
                conversation.option = [
                  {
                    label: "Yes (Same Product or Service)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "Yes (Other Product or Service)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "No",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.1.5.2",
                  },
                ];
                conversation.optionMessage = "Do you have any other query?";
              } else if (this.languageCode == "te") {
                conversation.option = [
                  {
                    label: "అవును (అదే ఉత్పత్తి లేదా సేవ)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "అవును (ఇతర ఉత్పత్తి లేదా సేవ)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "కాదు",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4.1.2",
                  },
                ];

                conversation.optionMessage = "మీకు ఏవైనా ఇతర ప్రశ్నలు ఉన్నాయా?";
              } else if (this.languageCode == "gu") {
                conversation.option = [
                  {
                    label: "હા (સમાન ઉત્પાદન અથવા સેવા)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "હા (અન્ય ઉત્પાદન અથવા સેવા)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "ના",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4.1.2",
                  },
                ];

                conversation.optionMessage =
                  "શું તમારી પાસે અન્ય કોઈ પ્રશ્નો છે?";
              } else if (this.languageCode == "hi") {
                conversation.option = [
                  {
                    label: "हाँ (वही प्रोडक्ट या सेवा)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "हाँ (अन्य प्रोडक्ट या सेवा)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "नहीं",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4.1.2",
                  },
                ];

                conversation.optionMessage = "क्या आपके पास और कोई सवाल हैं?";
              } else if (this.languageCode == "mr") {
                conversation.option = [
                  {
                    label: "होय (समान उत्पादन किंवा सेवा)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6",
                  },
                  {
                    label: "होय (इतर उत्पादन किंवा सेवा)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "नाही",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6.4.2",
                  },
                ];

                conversation.optionMessage =
                  "तुम्हाला आणखी काही प्रश्न आहेत का?";
              } else if (this.languageCode == "kn") {
                conversation.option = [
                  {
                    label: "ಹೌದು (ಅದೇ ಉತ್ಪನ್ನ ಅಥವಾ ಸೇವೆ)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6",
                  },
                  {
                    label: "ಹೌದು (ಇತರೆ ಉತ್ಪನ್ನ ಅಥವಾ ಸೇವೆ)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "ಇಲ್ಲ",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6.4.2",
                  },
                ];
                conversation.optionMessage =
                  "ನೀವು ಯಾವುದೇ ಹೆಚ್ಚಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಹೊಂದಿದ್ದೀರಾ?";
              } else if (this.languageCode == "bn") {
                conversation.option = [
                  {
                    label: "হ্যাঁ (একই পণ্য বা পরিষেবা)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "হ্যাঁ (অন্যান্য পণ্য বা পরিষেবা)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "না",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4.1.2",
                  },
                ];

                conversation.optionMessage = "আপনার কি অন্য কোন প্রশ্ন আছে?";
              } else if (this.languageCode == "ta") {
                conversation.option = [
                  {
                    label: "ஆம் (அதே தயாரிப்பு அல்லது சேவை)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "ஆம் (பிற தயாரிப்பு அல்லது சேவை)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "இல்லை",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4.1.2",
                  },
                ];

                conversation.optionMessage =
                  "உங்களிடம் வேறு ஏதேனும் கேள்வி உள்ளதா?";
              } else if (this.languageCode == "ml") {
                conversation.option = [
                  {
                    label: "അതെ (അതേ ഉൽപ്പന്നം അല്ലെങ്കിൽ സേവനം)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "അതെ (മറ്റ് ഉൽപ്പന്നമോ സേവനമോ)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {   
                    label: "ഇല്ല",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4.1.2",
                  },
                ];

                conversation.optionMessage =
                  "നിങ്ങൾക്ക് കൂടുതൽ ചോദ്യങ്ങളുണ്ടോ?";
              } else if (this.languageCode == "pa") {
                conversation.option = [
                  {
                    label: "ਹਾਂ (ਉਹੀ ਉਤਪਾਦ ਜਾਂ ਸੇਵਾ)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "ਹਾਂ (ਹੋਰ ਉਤਪਾਦ ਜਾਂ ਸੇਵਾ)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "ਨਹੀਂ",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4.1.2",
                  },
                ];              
                conversation.optionMessage = "ਕੀ ਤੁਹਾਡੇ ਕੋਈ ਹੋਰ ਸਵਾਲ ਹਨ?";
              } else if (this.languageCode == "or") {
                conversation.option = [
                  {
                    label: "ହଁ (ସମାନ ଉତ୍ପାଦ କିମ୍ବା ସେବା)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },  
                  
                  {
                    label: "ହଁ (ଅନ୍ୟ ଉତ୍ପାଦ କିମ୍ବା ସେବା)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "ନା",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.5.1.2",
                  },
                ];
                conversation.optionMessage = "ଆପଣଙ୍କର ଅନ୍ୟ  କ୍ୱେରି  ଣସି ପ୍ରଶ୍ନ ଅଛି କି?";
              }else if (this.languageCode == "asm") {
                conversation.option = [
                  {
                    label: "হয় (একেটা পণ্য বা সেৱা)",
                    value: this.selectedCategory.value
                      ? this.selectedCategory.value
                      : "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "হয় (অন্য পণ্য বা সেৱা)",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1",
                  },
                  {
                    label: "নহয়",
                    value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.1.5.2",
                  },
                ];
                conversation.optionMessage = "আপোনাৰ আৰু কিবা প্ৰশ্ন আছেনে?";
              }
            }
          }
        }

        // this.optflg = false;
        // this.optflg_Nearest = false;

        conversation.showMore = this.countWords(data.ReplyData.answer);
        conversation.showMoreEnable = false;
        conversation.showing = 1;
        this.voiceSrc = data.ReplyData.audio;
        conversation.video = data.ReplyData.video;
        if(conversation.video === 'https://storage.googleapis.com/digisaathi/digisaathi.in-maa-1.linodeobjects.com/VID-20240208-WA0009.mp4'){
          this.autoplayEnabled = true
        } else {
          this.autoplayEnabled = false;
        }

        if (data.ReplyData.answer && data.ReplyData.answer != "") {
          if (this.nextMessageBank) {
            let answer = this.convertNumber(data.ReplyData.answer);
            answer = this.convertEmail(answer);
            answer = this.convertURL(answer);
            conversation.botReply = this.checkBotReply(answer);
          } else {
            let answer = data.ReplyData.answer;
            conversation.botReply = this.checkBotReply(answer);
          }

          // ADDED BHARATGPT logo
  if(data.ReplyData && data.ReplyData.BharatGPT){
conversation.bharatGPT = data.ReplyData.BharatGPT
conversation.refreshBtn=true;
  }


          if (data.ReplyData.isFallback) {
            this.nextMessageBank = true;
          } else {
            this.nextMessageBank = false;
          }
        }

        if (data.ReplyData.card) {
          conversation.card = data.ReplyData.card;
        }

        conversation.descriptionViewMore = false;
        conversation.descriptionViewMoreEnable = false;
        if (data.ReplyData.description) {
          conversation.description = data.ReplyData.description;
          if (data.ReplyData.description.length > 5) {
            conversation.descriptionViewMore = true;
          }
        }

        if (data.ReplyData.carousel) {
          if (data.ReplyData.carousel.length == 1) {
            this.slideConfig.slidesToShow = 1;
          } else if (this.userAgentdeveice) {
            this.slideConfig.slidesToShow = 1.5;
          } else {
            this.slideConfig.slidesToShow = 1.7;
          }
          conversation.carousel = data.ReplyData.carousel;
        }

        if (data.ReplyData.feedback) {
          conversation.feedback = data.ReplyData.feedback;
        }

        if (data.ReplyData.isFallback) {
          conversation.isFallback = true;
        }
        if (data.ReplyData.userToken) {
          conversation.userToken = data.ReplyData.userToken;
        }

        if (
          conversation.botReply &&
          conversation.botReply !== "" &&
          !conversation.feedback &&
          !conversation.isFallback &&
          data.ReplyData.greeting !== true &&
          conversation.botReply !== "<p>Let me know your query</p>" &&
          conversation.botReply !== "<p>मुझे अपनी प्रश्न बताएं</p>" &&
          conversation.botReply !== "<p>कृपया मुझे अपना प्रश्न बताएं</p>" &&
          conversation.botReply !== "<p>मला तुमचा प्रश्न कळवा</p>" &&
          conversation.botReply !== "<p>मला तुमची प्रश्न कळवा</p>" &&
          conversation.botReply !== "<p>ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನನಗೆ ತಿಳಿಸಿ</p>" &&
          conversation.botReply !== "<p>আমাকে আপনার প্রশ্ন জানান</p>" &&
          conversation.botReply !== "<p>আমাকে আপনার প্রশ্ন জানতে দিন</p>" &&
          conversation.botReply !==
            "<p>உங்கள் கேள்வியை எனக்குத் தெரியப்படுத்துங்கள்</p>" &&
          // Assamese & Odia
          conversation.botReply !==  "<p>আপোনাৰ প্ৰশ্ন মোক জনাওক</p>" &&
          conversation.botReply !== '<p>ମୋତେ ତୁମର ଜିଜ୍ଞାସା ଜଣାଇବାକୁ ଦିଅ|</p>' &&

          conversation.botReply !== "<p>મને તમારી ક્વેરી જણાવો</p>" &&
          conversation.botReply !== "<p>మీ ప్రశ్నను నాకు తెలియజేయండి</p>" &&
          conversation.botReply !== "<p>നിങ്ങളുടെ ചോദ്യം എന്നെ അറിയിക്കൂ</p>" &&
          conversation.botReply !== "<p>ਮੈਨੂੰ ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਬਾਰੇ ਦੱਸੋ</p>" &&

          conversation.botReply !== "<p>ମୋତେ ଆପଣଙ୍କ କ୍ୱେରି ଜଣାନ୍ତୁ</p>" &&

          conversation.botReply !==
            "<p><strong>Thank you for contacting. Hope to meet you soon.</strong></p>" &&
          conversation.botReply !==
            "<p><strong>सम्पर्क करने के लिये आपको धन्यवाद। तुमसे जल्द मिलने की आशा करता हूँ।</strong></p>" &&
          conversation.botReply !==
            "<p><strong>संपर्क केल्याबद्दल धन्यवाद. लवकरच भेटू अशी आशा आहे.</strong></p>" &&
            
          // Assamese & Odia
          conversation.botReply !==
          "<p><strong>ଯୋଗାଯୋଗ ପାଇଁ ଧନ୍ୟବାଦ| ଶୀଘ୍ର ତୁମକୁ ଭେଟିବାକୁ ଆଶା କରୁଛି|</strong></p>" &&
          conversation.botReply !==
          "<p><strong>যোগাযোগ কৰাৰ বাবে ধন্যবাদ। আশা কৰিছো সোনকালে লগ পাম।</strong></p>" 
        ) {
          let nearestQuestionArray = this.getNearestQuestionArray(
            this.userQuery
          );
          if (nearestQuestionArray.length <= 0) {
            conversation.similarQuestions = false;
          } else {
            conversation.similarQuestions = nearestQuestionArray;
          }
        }
        
        conversation.alsoTry = this.alsoTry;
        conversation.showRelatedQuery = true;
        conversation.disableRating = false;
        conversation.comment = false;
        conversation.rating = "";
        conversation.ratingValue = 0;
        conversation.optionsDisabled = false;

        console.log(conversation);
      } else if (data.status == 404) {
        conversation.botReply = this.decodeBase64(data.ReplyData);
        // console.log(data.ReplyData);
        this.voiceSrc = data.audio;

        // conversation.trendingOptions = Chatdata[404][this.languageCode];
      }

      conversation.userQuery = this.userQuery;
      conversation.dtm = new Date();
      conversation.answerId = data.ReplyData.answerId;
      // console.log(conversation.userQuery);
      setTimeout(() => {
        this.typing = false;
        this.conversations.push(conversation);
        // console.log(this.conversations);
        this.audioSupport = true;
        if (this.QueryMode == 2) {
          this.playAudio();
        } else {
          this.pauseFunction();
        }
        // if (messageStepsFlow.required) {
        //   this.userQuery = null;
        //   for (let i = 1; i < messageStepsFlow.message.length; ++i) {
        //     this.setDelayMessages(i);
        //   }
        // }
      }, 100);
    });

    this.apiservice.modSubject$.subscribe((mode) => {
      this.QueryMode = mode;
      switch (mode) {
        case 1:
          this.spkrplay = true;
          this.spkrStop = false;
          break;
        case 3:
          this.pauseFunction();
          break;
        default:
          this.spkrplay = false;
          this.spkrStop = true;
      }
    });
  }

  ngOnInit() {
    // console.log(this.trendingOptions);
    let lang = sessionStorage.getItem("lang")
      ? sessionStorage.getItem("lang")
      : localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "en";

    if (lang) {
      if (lang == "en") {
        this.setLanguage(lang, "English", false);
      } else if (lang == "hi") {
        this.setLanguage(lang, "Hindi (हिंदी)", false);
      } else if (lang == "mr") {
        this.setLanguage(lang, "Marathi (मराठी)", false);
      } else if (lang == "kn") {
        this.setLanguage(lang, "Kannada (ಕನ್ನಡ)", false);
      } else if (lang == "bn") {
        this.setLanguage(lang, "Bengali (বাংলা)", false);
      } else if (lang == "ta") {
        this.setLanguage(lang, "Tamil (தமிழ்)", false);
      } else if (lang == "te") {
        this.setLanguage(lang, "Telugu (తెలుగు)", false);
      } else if (lang == "gu") {
        this.setLanguage(lang, "Gujarati (ગુજરાતી)", false);
      } else if (lang == "ml") {
        this.setLanguage(lang, "Malayalam (മലയാളം)", false);
      } else if (lang == "pa") {
        this.setLanguage(lang, "Punjabi (ਪੰਜਾਬੀ)", false);
      }else if (lang == "or") {
        this.setLanguage(lang, "Odia (ଓଡ଼ିଆ)", false);
      }else if (lang == "asm") {
        this.setLanguage(lang, "Assamese (অসমীয়া)", false);
      }
    } else {
      this.setLanguage("en", "English", false);
    }
    this.languageSelect = false;
    this.sessionTimer();
    this.trendingOptions = Chatdata[404]["car"];
    // console.log(Chatdata[404].en);

    // welcome
    this.typing = true;
    setTimeout(() => {
      this.welcomeOne = true;
    }, 2000);
    // setTimeout(() => {
    //    this.welcomeTwo = true;
    // }, 4000);
    setTimeout(() => {
      this.welcomeThree = true;
      this.typing = false;
    }, 3000);

    this.widgetInterval = setInterval(() => {
      if (this.widgetIntervalCount > 6) {
        clearInterval(this.widgetInterval);
        return;
      }
      this.inactive_widget = true;
      console.log("widget true");
      setTimeout(() => {
        this.inactive_widget = false;
        this.widgetIntervalCount++;
      }, 30000);
    }, this.activeInterval);
  }

  trendingSelection(query) {
    this.feedbackoptions = false;
    this.apiservice.userQuerySend(query, 1, null, 1, null);
  }

  like(data, feedback, event, optionsDisabled) {
    if (optionsDisabled) {
      return;
    }
    this.payload = {
      answerId: data.answerId,
      feedback: feedback,
      comment: null,
      userToken: data.userToken,
    };
    // console.log(this.payload);
    this.Disflg = false;
    event.currentTarget.parentNode.parentNode.classList.add("disabled");
    event.target.setAttribute("style", "color:green;");
    this.apiservice.feedBack(this.payload).subscribe((data: any) => {});
    this.feedflg = true;
    const comment = Array.from(
      document.getElementsByClassName("comment") as HTMLCollectionOf<
        HTMLElement
      >
    );
    if (comment != null) {
      comment.forEach((feed) => (feed.style.display = "none"));
    }
    setTimeout(() => {
      this.feedflg = false;
      this.userQuery = "";

      setTimeout(() => {
        this.feedbackoptions = !this.feedbackoptions;
        // console.log("feedback");
      }, 2000);
    }, 3000);
  }

  dislike(data, feedback, event, optionsDisabled) {
    if (optionsDisabled) {
      return;
    }
    // event.currentTarget.parentNode.parentNode.classList.add("disabled");
    // console.log(event.currentTarget.parentNode.nextSibling);
    event.target.setAttribute("style", "color:#c62828;");
    event.currentTarget.parentNode.nextSibling.style.display = "block";
    this.payload = {
      answerId: data.answerId,
      feedback: feedback,
      comment: null,
      userToken: data.userToken,
    };
    //  console.log(this.payload);
    // this.Disflg = !this.Disflg;
  }

  submitFeed(event) {
    this.payload.comment = this.Feedbk;
    // console.log(this.Feedbk.trim());
    if (this.Feedbk.trim().length == 0) {
      this.valiflg = true;
      this.feedmintext = true;
      setTimeout(() => {
        this.feedmintext = false;
        this.valiflg = false;
      }, 3000);
    } else if (this.Feedbk.trim().length <= 25) {
      this.badSenFlag = true;
      this.feedmintext = true;
    } else {
      this.apiservice.feedBack(this.payload).subscribe((data: any) => {});
      event.target.setAttribute("style", "color:#c62828;");
      event.currentTarget.parentNode.parentNode.parentNode.parentNode.classList.add(
        "disabled"
      );
      event.currentTarget.parentNode.parentNode.parentNode.style.display =
        "none";
      this.Feedbk = "";
      this.badSenFlag = false;
      this.valiflg = false;
      this.Disflg = false;
      this.feedDisflg = true;
      this.feedmintext = false;

      setTimeout(() => {
        this.feedDisflg = false;
        this.userQuery = "";

        setTimeout(() => {
          this.feedbackoptions = !this.feedbackoptions;
          // console.log("feedback");
        }, 2000);
      }, 3000);
    }
  }
  cancelFeed(event) {
    // console.log(event.currentTarget.parentNode.parentNode.parentNode);
    event.currentTarget.parentNode.parentNode.parentNode.style.display = "none";
    this.Disflg = !this.Disflg;
  }

  toggleWidget(value, label, labelCode) {
    this.inactive_widget = false;
    if (labelCode == "Yes") {
      clearInterval(this.widgetInterval);
      this.widgetIntervalCount = 0;
      this.widgetInterval = setInterval(() => {
        if (this.widgetIntervalCount > 6) {
          clearInterval(this.widgetInterval);
          return;
        }
        this.inactive_widget = true;

        setTimeout(() => {
          this.inactive_widget = false;
          this.widgetIntervalCount++;
        }, 30000);
      }, this.activeInterval);

      if (this.autoriseBotToggle == false) {
        label = "Continue";
        this.autoriseBotToggle = true;
      }
    } else if (labelCode == "No") {
      clearInterval(this.widgetInterval);
      this.widgetIntervalCount = 7;
      this.autoriseBotToggle = true;
    }
    this.apiservice.userQuerySend(value, 3, label, 1, null);
  }
  optionSelection(value, label, idx, optionsDisabled) {
    if (optionsDisabled) {
      return;
    }
    const comment = Array.from(
      document.getElementsByClassName("comment") as HTMLCollectionOf<
        HTMLElement
      >
    );
    if (comment != null) {
      comment.forEach((feed) => (feed.style.display = "none"));
    }
    // console.log(comment);
    this.feedbackoptions = false;
    this.Disflg = false;
    this.userQuery = label;

    this.getSelectedCategory(value, label);

    if (idx !== null) {
      this.conversations[idx].optionsDisabled = true;
    }

    this.apiservice.userQuerySend(value, 2, label, 1, null);
    if(label === 'UPI123Pay' || label === 'यूपीआई123पे'){
    this.apiservice.tracker(label).subscribe((data)=>{})
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  setDelayMessages(i) {
    setTimeout(() => {
      this.typing = true;
      setTimeout(() => {
        this.conversations[this.conversations.length - 1].showing =
          this.conversations[this.conversations.length - 1].showing + 1;
        this.typing = false;
      }, 2000);
    }, i * 3000);
  }

  decodeBase64(data) {
    const base64Rejex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
    const isBase64Validbtn = base64Rejex.test(data); // base64Data is the base64 string
    if (isBase64Validbtn) {
      return decodeURIComponent(escape(window.atob(data)));
    } else {
      return data;
    }
  }

  sessionTimer() {
    interval(1000).subscribe(
      (value: number) => {
        this.timeSpend = new Date(0, 0, 0);
        this.timeSpend.setSeconds(value);
      },
      (error: any) => {
        console.log("error");
      },
      () => {
        // console.log("observable completed !");
      }
    );
  }

  scrollToBottom(): void {
    // this.scrolltop = this.myScrollContainer.nativeElement.scrollHeight
  }

  checkOptions(data) {
    if (data.options != null) {
      return data.options;
    } else {
      return false;
    }
  }

  sendfeedback() {
    //   let payload = {
    //     "answerId" : ,
    //     "feedback" : "Dislike",
    //     "comment" : "it is very bad"
    //  }
  }

  setLanguage(langCode, langLabel, firstTime) {

    if (this.languageSelect && firstTime) {
      return;
    }
    this.languageCode = langCode;
    this.languageSet = langLabel;
    this.trendingOptions = Chatdata[404][this.languageCode];
    this.apiservice.changeLang(langCode);

    if (!this.languageSelect && firstTime) {
      this.languageSelect = true;

      this.typing = true;
      setTimeout(() => {
        this.typing = false;
        this.welcomeTwo = true;
        this.typing = true;
      }, 2000);
      setTimeout(() => {
        this.typing = false;
        this.welcomeFour = true;
        this.typing = true;
      }, 4000);
      setTimeout(() => {
        this.typing = false;
        this.welcomeFive = true;
      }, 6000);
      this.isSubmitted = true;
    }

    if (langCode === "en") {
      if (!this.isSubmitted) {
        this.chat4 = "Thank you 😃 for submitting your feedback.";

        this.chat1 = "Hello👋 <br> <b>DigiSaathi</b> welcomes you!";
        this.langHeader = "Please select your language.";
      }
      if (firstTime) {
        this.chat2 =
          "I am your Digital Assistant.<br><br> I am here to help you to get information on Digital Payment Products & Services. ";
        this.confirm =
          "Please confirm to continue with this conversation and avail the information.";
        this.continue = "Continue";
        this.abort = "Abort";

        this.chat3 =
          "Please do not share any personal information like Name, PAN, Phone Number, Aadhaar Number, UPI PIN, Card Number, Account Number, Password, PIN, OTP, Transaction Details etc. while asking your query.";
      }
    } else if (langCode === "te") {
      if (!this.isSubmitted) {
        this.chat4 = "మీ అభిప్రాయాన్ని సమర్పించినందుకు ధన్యవాదాలు 😃.";

        this.chat1 = "హలో👋 <br> <b>డిజిసాతి</b> మీకు స్వాగతం పలుకుతుంది!";
        this.langHeader = "దయచేసి మీ భాషను ఎంచుకోండి.";
      }
      if (firstTime) {
        this.chat2 =
          "నేను మీ డిజిటల్ అసిస్టెంట్‌ని.<br><br> డిజిటల్ చెల్లింపు ఉత్పత్తులు & సేవలపై సమాచారాన్ని పొందడానికి మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. ";
        this.confirm =
          "దయచేసి ఈ సంభాషణతో కొనసాగడానికి మరియు సమాచారాన్ని పొందేందుకు నిర్ధారించండి.";
        this.continue = "కొనసాగించు";
        this.abort = "రద్దు చేయి";

        this.chat3 =
          "దయచేసి మీ ప్రశ్నను అడుగుతున్నప్పుడు పేరు, పాన్, ఫోన్ నంబర్, ఆధార్ నంబర్, UPI పిన్, కార్డ్ నంబర్, ఖాతా నంబర్, పాస్‌వర్డ్, పిన్, OTP, లావాదేవీ వివరాలు మొదలైన వ్యక్తిగత సమాచారాన్ని పంచుకోవద్దు.";
      }
    } else if (langCode === "gu") {
      if (!this.isSubmitted) {
        this.chat4 = "તમારો પ્રતિસાદ સબમિટ કરવા બદલ આભાર 😃.";

        this.chat1 = "હેલો👋<br> <b>ડીજીસાથી</b> તમારું સ્વાગત કરે છે!";
        this.langHeader = "કૃપા કરીને તમારી ભાષા પસંદ કરો";
      }
      if (firstTime) {
        this.chat2 =
          " હું તમારો ડિજિટલ સહાયક છું.<br><br>  હું તમને ડિજિટલ પેમેન્ટ પ્રોડક્ટ્સ અને સેવાઓ વિશે માહિતી મેળવવામાં મદદ કરવા માટે અહીં છું. ";
        this.confirm =
          "કૃપા કરીને આ વાતચીત ચાલુ રાખવા અને માહિતી મેળવવા માટે ખાતરી કરો.";
        this.continue = " ચાલુ રાખો";
        this.abort = " મધ્યમાં રોકો";

        this.chat3 =
          "કૃપા કરીને તમારા પ્રશ્નો પૂછતી વખતે નામ, પાન, ફોન નંબર, આધાર નંબર, ઉપીઆઈ પિન, કાર્ડ નંબર, એકાઉન્ટ નંબર, પાસવર્ડ, પિન, ઓટીપી, ટ્રાન્ઝેક્શન વિગતો વગેરે જેવી કોઈપણ વ્યક્તિગત માહિતી શેર કરશો નહીં.";
      }
    } else if (langCode === "hi") {
      if (!this.isSubmitted) {
        this.chat4 = "अपना फीडबैक देने के लिए धन्यवाद 😃";

        this.chat1 = "नमस्ते🙏<br><b>डिजिसाथी</b> आपका स्वागत करता है!";
        this.langHeader = "कृपया अपनी भाषा चुनें।";
      }
      if (firstTime) {
        this.chat2 =
          "मैं आपका  डिजिटल सहायक  हूं।<br><br>आप डिजिटल पेमेंट प्रोडक्ट्स और सेवाओं के बारे में जानकारी प्राप्त कर सकते हैं ";
        this.confirm =
          "कृपया इस बातचीत को जारी रखने और जानकारी का लाभ उठाने की पुष्टि करें।";
        this.chat3 =
          "कृपया अपना प्रश्न पूछते समय कोई भी व्यक्तिगत जानकारी जैसे नाम, PAN, फोन नंबर, आधार नंबर, UPI PIN, कार्ड नंबर, खाता संख्या, पासवर्ड, PIN, OTP, ट्रांजेक्शन विवरण आदि साझा न करें।";
        this.continue = "जारी रखें";
        this.abort = "निरस्त";
      }
    } else if (langCode === "kn") {
      if (!this.isSubmitted) {
        this.chat4 = "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸಲ್ಲಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು 😃.";

        this.chat1 = "ನಮಸ್ಕಾರ👋 <br> <b>ಡಿಜಿಸಾಥಿ</b> ನಿಮ್ಮನ್ನು ಸ್ವಾಗತಿಸುತ್ತದೆ!";
        this.langHeader = "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.";
      }
      if (firstTime) {
        this.chat2 =
          "ನಾನು ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸಹಾಯಕ.<br><br> ಡಿಜಿಟಲ್ ಪಾವತಿ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಸೇವೆಗಳ ಕುರಿತು ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.";
        this.confirm =
          "ಈ ಸಂಭಾಷಣೆಯನ್ನು ಮುಂದುವರಿಸಲು ಮತ್ತು ಮಾಹಿತಿಯನ್ನು ಪಡೆದುಕೊಳ್ಳಲು ದಯವಿಟ್ಟು ಖಚಿತಪಡಿಸಿ.";
        this.continue = "ಮುಂದುವರಿಸಿ";
        this.abort = "ಸ್ಥಗಿತಗೊಳಿಸಿ";

        this.chat3 =
          "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳುವಾಗ ಹೆಸರು, PAN, ಫೋನ್ ಸಂಖ್ಯೆ, ಆಧಾರ್ ಸಂಖ್ಯೆ, UPI PIN, ಕಾರ್ಡ್ ಸಂಖ್ಯೆ, ಖಾತೆ ಸಂಖ್ಯೆ, ಪಾಸ್‌ವರ್ಡ್, PIN, OTP, ವಹಿವಾಟಿನ ವಿವರಗಳು ಮುಂತಾದ ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ದಯವಿಟ್ಟು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.";
      }
    } else if (langCode === "mr") {
      if (!this.isSubmitted) {
        this.chat4 = "तुमचा अभिप्राय सबमिट केल्याबद्दल धन्यवाद 😃.";

        this.chat1 = "नमस्कार👋 <br> <b>DigiSaathi</b> तुमचे स्वागत आहे!";
        this.langHeader = "कृपया तुमची भाषा निवडा.";
      }
      if (firstTime) {
        this.chat2 =
          "मी तुमचा डिजिटल असिस्टंट आहे.<br><br>डिजिटल पेमेंट उत्पादने आणि सेवांबद्दल माहिती मिळविण्यासाठी मी तुम्हाला मदत करण्यासाठी येथे आहे.";
        this.confirm =
          "कृपया हे संभाषण सुरू ठेवण्यासाठी पुष्टी करा आणि माहितीचा लाभ घ्या.";
        this.continue = "सुरू";
        this.abort = "निरस्त करा";

        this.chat3 =
          "कृपया तुमची प्रश्न विचारत असताना नाव, पॅन, फोन नंबर, आधार क्रमांक, UPI PIN, कार्ड क्रमांक, खाते क्रमांक, पासवर्ड, PIN, OTP, व्यवहार तपशील इत्यादी कोणतीही वैयक्तिक माहिती शेअर करू नका.";
      }
    } else if (langCode === "ta") {
      {
        if (!this.isSubmitted) {
          this.chat4 = "உங்கள் கருத்தைச் சமர்ப்பித்ததற்கு நன்றி 😃.";

          this.chat1 = "வணக்கம்👋 <br> <b>DigiSaathi</b> உங்களை வரவேற்கிறது!";
          this.langHeader = "தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்.";
        }
        if (firstTime) {
          this.chat2 =
            "நான் உங்கள் டிஜிட்டல் உதவியாளர்.<br><br> டிஜிட்டல் பேமெண்ட் தயாரிப்புகள் & சேவைகள் பற்றிய தகவல்களைப் பெற உங்களுக்கு உதவ நான் இங்கு வந்துள்ளேன்.";
          this.confirm =
            "இந்த உரையாடலைத் தொடரவும், தகவலைப் பெறவும் உறுதிப்படுத்தவும்.";
          this.continue = "உரையாடலைத் தொடரவும்";
          this.abort = "உரையாடலை நிறுத்தவும்";

          this.chat3 =
            "நீங்கள் உங்களுடைய கேள்விகளைக்  கேட்கும்போது பெயர், பான், தொலைபேசி எண், ஆதார் எண், UPI பின், கார்டு எண், அக்கவுண்ட் நம்பர், பாஸ்வோர்ட், PIN, OTP, ட்ரான்ஸாக்ஷன் விவரங்கள் போன்ற எந்தவொரு தனிப்பட்ட தகவலையும் பகிர்ந்து கொள்ள வேண்டாம். இந்த உரையாடலைத் தொடரவும், தகவலைப் பெறவும்  தயவுசெய்து உறுதிப்படுத்துங்கள்.";
        }
      }
    } else if (langCode === "bn") {
      {
        if (!this.isSubmitted) {
          this.chat4 = "আপনার মতামত জমা দেওয়ার জন্য আপনাকে ধন্যবাদ 😃";

          this.chat1 = "হ্যালো👋 <br> <b>ডিজিসাথী</b> আপনাকে স্বাগত জানাচ্ছে!";
          this.langHeader = "আপনার ভাষা নির্বাচন করুন.";
        }
        if (firstTime) {
          this.chat2 =
            "আমি আপনার ডিজিটাল সহকারী।<br><br> ডিজিটাল পেমেন্ট পণ্য ও পরিষেবার তথ্য পেতে আপনাকে সাহায্য করতে আমি এখানে আছি।";
          this.confirm =
            "এই কথোপকথন চালিয়ে যেতে এবং তথ্য পেতে দয়া করে নিশ্চিত করুন৷";
          this.continue = "চালু রাখুন";
          this.abort = "বেরিয়ে যান";

          this.chat3 =
            "আপনার প্রশ্ন জিজ্ঞাসা করার সময় দয়া করে কোন ব্যক্তিগত তথ্য যেমন নাম, PAN, ফোন নম্বর, আধার নম্বর, UPI PIN, কার্ড নম্বর, অ্যাকাউন্ট নম্বর, পাসওয়ার্ড, PIN, OTP, লেনদেন সংক্রান্ত বিবরণ ইত্যাদি শেয়ার করবেন না। এই কথোপকথন চালিয়ে যেতে এবং তথ্য পেতে দয়া করে নিশ্চিত করুন। ";
        }
      }
    } else if (langCode === "ml") {
      if (!this.isSubmitted) {
        this.chat4 = "നിങ്ങളുടെ ഫീഡ്‌ബാക്ക് സമർപ്പിച്ചതിന് 😃 നന്ദി.";

        this.chat1 = "ഹലോ👋 <br> <b>ഡിജിസാതി</b> നിങ്ങളെ സ്വാഗതം ചെയ്യുന്നു!";
        this.langHeader = "ദയവായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക.";
      }
      if (firstTime) {
        this.chat2 =
          "ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ അസിസ്റ്റന്റാണ്.<br><br> ഡിജിറ്റൽ പേയ്‌മെന്റ് ഉൽപ്പന്നങ്ങളെയും സേവനങ്ങളെയും കുറിച്ചുള്ള വിവരങ്ങൾ ലഭിക്കാൻ നിങ്ങളെ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. ";
        this.confirm =
          "ഈ സംഭാഷണം തുടരാനും വിവരങ്ങൾ പ്രയോജനപ്പെടുത്താനും ദയവായി സ്ഥിരീകരിക്കുക.";
        this.continue = "തുടരുക";
        this.abort = "ഉപേക്ഷിക്കുക";

        this.chat3 =
          "നിങ്ങളുടെ ചോദ്യം ചോദിക്കുമ്പോൾ പേര്, പാൻ, ഫോൺ നമ്പർ, ആധാർ നമ്പർ, UPI പിൻ, കാർഡ് നമ്പർ, അക്കൗണ്ട് നമ്പർ, പാസ്‌വേഡ്, പിൻ, OTP, ഇടപാട് വിശദാംശങ്ങൾ തുടങ്ങിയ സ്വകാര്യ വിവരങ്ങളൊന്നും പങ്കിടരുത്.";
      }
    } else if (langCode === "pa") {
      if (!this.isSubmitted) {
        this.chat4 = "ਤੁਹਾਡਾ ਫੀਡਬੈਕ ਦਰਜ ਕਰਨ ਲਈ ਤੁਹਾਡਾ ਧੰਨਵਾਦ 😃।";

        this.chat1 = "ਹੈਲੋ👋 <br> <b>ਡਿਜੀਸਾਥੀ</b> ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ!";
        this.langHeader = "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ।";
      }
      if (firstTime) {
        this.chat2 =
          "ਮੈਂ ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਸਹਾਇਕ ਹਾਂ।<br><br> ਮੈਂ ਇੱਥੇ ਡਿਜੀਟਲ ਭੁਗਤਾਨ ਉਤਪਾਦਾਂ ਅਤੇ ਸੇਵਾਵਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਹਾਂ।";
        this.confirm =
          "ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਗੱਲਬਾਤ ਨੂੰ ਜਾਰੀ ਰੱਖਣ ਲਈ ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ।";
        this.continue = "ਜਾਰੀ ਰੱਖੋ";
        this.abort = "ਅਧੂਰਾ ਛੱਡੋ";

        this.chat3 =
          "ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਵੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਜਿਵੇਂ ਕਿ ਨਾਮ, ਪੈਨ, ਫ਼ੋਨ ਨੰਬਰ, ਆਧਾਰ ਨੰਬਰ, UPI ਪਿੰਨ, ਕਾਰਡ ਨੰਬਰ, ਖਾਤਾ ਨੰਬਰ, ਪਾਸਵਰਡ, PIN, OTP, ਲੈਣ-ਦੇਣ ਵੇਰਵੇ ਆਦਿ ਨੂੰ ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਪੁੱਛਣ ਵੇਲੇ ਸਾਂਝੀ ਨਾ ਕਰੋ।";
      }
    }else if (langCode === "or") {
      if (!this.isSubmitted) {
        this.chat4 = "ଆପଣଙ୍କର ମତାମତ ଦାଖଲ କରିଥିବାରୁ ଧନ୍ୟବାଦ | 😃 ";

        this.chat1 = "ନମସ୍କାର👋 <br> <b>ଡିଜିସାଥୀ</b> ଆପଣଙ୍କୁ ସ୍ୱାଗତ କରୁଛି!";
        this.langHeader = "ଦୟାକରି ଆପଣଙ୍କର ଭାଷା ଚୟନ କରନ୍ତୁ |";
      }
      if (firstTime) {
        this.chat2 =
          "ମୁଁ ଆପଣଙ୍କର ଡିଜିଟାଲ୍ ଆସିଷ୍ଟାଣ୍ଟ୍ ଅଟେ.<br><br> ମୁଁ ଏଠାରେ ଆପଣଙ୍କୁ ଡିଜିଟାଲ୍ ପେମେଣ୍ଟ ଉତ୍ପାଦ ଏବଂ ସେବାଗୁଡିକରେ ସୂଚନା ପାଇବା ପାଇଁ ସହାୟତା କରିବି। ";
        this.confirm =
          "ଦୟାକରି ଏହି ବାର୍ତ୍ତାଳାପ ସହିତ ଜାରି ରଖିବାକୁ ନିଶ୍ଚିତ କରନ୍ତୁ ଏବଂ ସୂଚନା ପ୍ରାପ୍ତ କରନ୍ତୁ |";
        this.continue = "ଜାରି ରଖ ";
        this.abort = "ପରିତ୍ୟାଗ";

        this.chat3 =
          "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ପଚାରିବାବେଳେ ଦୟାକରି ନାମ, ପ୍ୟାନ୍, ଫୋନ୍ ନମ୍ବର, ଆଧାର ନମ୍ବର, ୟୁ.ପି.ଆଇ ପିନ୍, କାର୍ଡ ନମ୍ବର, ଆକାଉଣ୍ଟ ନମ୍ବର, ପାସୱାର୍ଡ, ପିନ୍, ଓ.ଟି.ପି, କାରବାର ବିବରଣୀ ଇତ୍ୟାଦି କୌଣସି ବ୍ୟକ୍ତିଗତ ସୂଚନା ଅଂଶୀଦାର କରନ୍ତୁ ନାହିଁ। ";
      }
  
    }
    else if (langCode === "asm") {
      if (!this.isSubmitted) {
          this.chat4 = "ধন্যবাদ 😃 আপোনাৰ মতামত জমা দিয়াৰ বাবে।";
  
          this.chat1 = "নমস্কাৰ👋 <br> <b>ডিজিসাথী</b> আপোনাক স্বাগতম জনাইছো!";
          this.langHeader = "অনুগ্ৰহ কৰি আপোনাৰ ভাষা নিৰ্বাচন কৰক।";
        }
        if (firstTime) {
          this.chat2 =
            "মই আপোনাৰ ডিজিটেল সহায়ক।<br><br> মই আপোনাক ডিজিটেল পেমেণ্ট প্ৰডাক্ট আৰু সেৱাৰ তথ্য লাভ কৰাত সহায় কৰিবলৈ ইয়াত আছো।";
          this.confirm =
            "অনুগ্ৰহ কৰি নিশ্চিত কৰক যে আপুনি এই কথোপকথন আগবঢ়াই নিব বিচাৰে আৰু তথ্য অভিগম কৰিব বিচাৰে";
          this.continue = "আগবাঢ়ি যাওক";
          this.abort = "সমাপ্ত";
  
          this.chat3 =
            "আপোনাৰ প্ৰশ্ন সোধাৰ সময়ত কোনো ব্যক্তিগত তথ্য যেনে নাম, পেন, ফোন নম্বৰ, আধাৰ নম্বৰ, ইউপিআই পিন, কাৰ্ড নম্বৰ, একাউণ্ট নম্বৰ, পাছৱৰ্ড, পিন, অ’টিপি, লেনদেনৰ সবিশেষ আদি শ্বেয়াৰ নকৰিব।";
        }
      }
  }

  play() {
    this.playAudio();
    this.spkrplay = false;
    this.spkrStop = true;
  }
  stop() {
    this.pauseFunction();
    this.spkrStop = false;
    this.spkrplay = true;
  }
  public playAudio() {
    this.myvoice = new Audio();
    this.myvoice.src = this.voiceSrc;
    this.myvoice.load();
    this.myvoice.play();
  }
  pauseFunction() {
    if (this.myvoice != undefined) {
      this.myvoice.pause();
    }
  }

  countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi, "");
    str = str.replace(/[ ]{2,}/gi, " ");
    str = str.replace(/\n /, "\n");
    let count = str.split(" ").length;
    if (count > 100) {
      return true;
    } else {
      return false;
    }
  }

  // handleMessage(even: Event) {
  //    const message = even as MessageEvent;

  //    // Only trust messages from the below origin.
  //    // if (message.origin !== 'http://example.com:8080') return;

  //    if (!message.data.type && message.data != "") {
  //       if (message.data.sourceUrl) {
  //          // console.log(message.data.sourceUrl);
  //          this.apiservice.setUrl(message.data);
  //       }

  //       if (message.data.sourceType == "bike") {
  //          this.trendingOptions = Chatdata[404]["bike"];
  //          this.ngOnDestroy();
  //       } else if (message.data.sourceType == "car") {
  //          this.trendingOptions = Chatdata[404]["car"];
  //          this.ngOnDestroy();
  //       } else {
  //          this.trendingOptions = Chatdata[404]["car"];
  //       }
  //    }
  // }

  ngOnDestroy() {
    // console.log("destroy")
    this.stopListening();
  }

  checkBotReply(reply) {
    if (
      reply === "<p><strong>Select one of the options below</strong></p>" ||
      reply === "<p><strong>Please select your query</strong></p>" ||
      reply === "<p><strong>कृपया मुझे अपना प्रश्न बताएं</strong></p>" ||
      reply === "<p><strong>कृपया अपना विकल्प चुनें</strong></p>" ||
      reply === "<p><strong>कृपया अपनी प्रश्न का चयन करें</strong></p>" ||
      reply === "<p><strong>कृपया अपना पसंद चुनें</strong></p>" ||
      reply === "<p><strong>खालील पर्यायांपैकी एक निवडा</strong></p>" ||
      reply === "<p><strong>कृपया तुमची क्वेरी निवडा</strong></p>" ||
      reply ===
        "<p><strong>ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ</strong></p>" ||
        
      reply ===
        "<p><strong>ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</strong></p>" ||
      reply ===
        "<p><strong>கீழே உள்ள விருப்பங்களில் ஒன்றைத் தேர்ந்தெடு</strong></p>" ||
      reply === "<p><strong>உங்கள் வினவலைத் தேர்ந்தெடுக்கவும்</strong></p>" ||
      reply ===
        "<p><strong>নীচের বিকল্পগুলির মধ্যে একটি নির্বাচন করুন</strong></p>" ||
      reply === "<p><strong>আপনার প্রশ্ন নির্বাচন করুন</strong></p>" ||
      reply ===
        "<p><strong>క్రింద ఉన్న ఎంపికలలో ఒకదాన్ని ఎంచుకోండి</strong></p>" ||
      reply === "<p><strong>దయచేసి మీ ప్రశ్నను ఎంచుకోండి</strong></p>" ||
      reply === "<p><strong>નીચેના વિકલ્પોમાંથી એક પસંદ કરો</strong></p>" ||
      reply === "<p><strong>કૃપા કરીને તમારી ક્વેરી પસંદ કરો</strong></p>" ||
      reply === "<p><strong>Please select your category</strong></p>" ||
      reply === "<p><strong>कृपया अपनी श्रेणी चुनें</strong></p>" ||
      reply === "<p><strong>कृपया आपली श्रेणी निवडा</strong></p>" ||
      reply === "<p><strong>ದಯವಿಟ್ಟು ನಿಮ್ಮ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ</strong></p>" ||
      reply === "<p><strong>உங்கள் வகையைத் தேர்ந்தெடுக்கவும்</strong></p>" ||
      // Assamee and Odia
      reply ===
        "<p><strong>অনুগ্রহ করে আপনার বিভাগ নির্বাচন করুন</strong></p>" ||
      reply ===
        "<p><strong>অনুগ্ৰহ কৰি আপোনাৰ শ্ৰেণীটো নিৰ্বাচন কৰক</strong></p>" ||
      reply ===
        "<p><strong>তলৰ বিকল্পসমূহৰ এটা বাছক</strong></p>" ||
      reply ===
        "<p><strong>ନିମ୍ନରେ ଥିବା ବିକଳ୍ପଗୁଡ଼ିକ ମଧ୍ୟରୁ ଗୋଟିଏ ବାଛନ୍ତୁ|</strong></p>" ||
      reply ===
        "<p><strong>ଦୟାକରି ଆପଣଙ୍କର ବର୍ଗ ଚୟନ କରନ୍ତୁ |</strong></p>" ||
      reply === "<p><strong>దయచేసి మీ వర్గాన్ని ఎంచుకోండి</strong></p>" ||
      reply === "<p><strong>કૃપા કરીને તમારી શ્રેણી પસંદ કરો</strong></p>" ||
      reply === "<p><strong>कृपया अपना प्रश्न चुनें</strong></p>" ||
      reply === "<p><strong>നിങ്ങളുടെ വിഭാഗം തിരഞ്ഞെടുക്കുക</strong></p>" ||
      reply ===
        "<p><strong>ചുവടെയുള്ള ഓപ്ഷനുകളിലൊന്ന് തിരഞ്ഞെടുക്കുക</strong></p>" ||
      reply ===
        "<p><strong>ദയവായി നിങ്ങളുടെ ചോദ്യം തിരഞ്ഞെടുക്കുക</strong></p>" ||
      reply === "<p><strong>നിങ്ങളുടെ ചോദ്യം എന്നോട് പറയൂ</strong></p>" ||
      reply ===
        "<p><strong>ദയവായി നിങ്ങളുടെ വിഭാഗം തിരഞ്ഞെടുക്കുക</strong></p>" ||
      reply ===
        "<p><strong>ദയവായി നിങ്ങളുടെ ചോദ്യം തിരഞ്ഞെടുക്കുക</strong></p>" ||
      reply === "<p><strong>ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਇੱਕ ਚੁਣੋ</strong></p>" ||
      reply === "<p><strong>ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਚੁਣੋ</strong></p>" ||
      reply === "<p><strong>ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਆਪਣਾ ਸਵਾਲ ਦੱਸੋ</strong></p>" ||
      reply === "<p><strong>ਆਪਣੀ ਸ਼੍ਰੇਣੀ ਚੁਣੋ</strong></p>" ||
      reply === "<p><strong>ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਸ਼੍ਰੇਣੀ ਚੁਣੋ</strong></p>" ||
      reply === "<p><strong>ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਵਾਲ ਚੁਣੋ</strong></p>"||
      reply === "<p><strong>ଦୟାକରି ଆପଣଙ୍କର କ୍ୱେରି ଚୟନ କରନ୍ତୁ</strong></p>"
    ) {
      return "";
    } else {
      return reply;
    }
  }

  hoverRating(e, idx) {
    let tooltips;
    if (this.languageCode == "en") {
      tooltips = [
        "Need Improvement",
        "Average",
        "Good",
        "Very Good",
        "Excellent",
      ];
    } else if (this.languageCode == "hi") {
      tooltips = ["सुधार की जरूरत", "औसत", "अच्छा", "बढ़िया", "अति उत्कृष्ट"];
    } else if (this.languageCode == "kn") {
      tooltips = [
        "ಸುಧಾರಣೆ ಬೇಕು",
        "ಸರಾಸರಿ",
        "ಒಳ್ಳೆಯದು",
        "ತುಂಬಾ ಒಳ್ಳೆಯದು",
        "ಅತ್ಯುತ್ತಮ",
      ];
    } else if (this.languageCode == "mr") {
      tooltips = ["सुधारणा हवी", "सरासरी", "चांगले", "खुप छान", "उत्कृष्ट"];
    } else if (this.languageCode == "ta") {
      tooltips = [
        "மேம்பாடு தேவை",
        "சுமார்",
        "நன்று",
        "மிகவும் நன்று",
        "சிறப்பு",
      ];
    } else if (this.languageCode == "bn") {
      tooltips = ["উন্নতি প্রয়োজন", "সাধারণ", "ভালো", "খুব ভালো", "অসাধারণ"];
    } else if (this.languageCode == "te") {
      tooltips = [
        "ఇంప్రూవ్‌మెంట్ కావాలి",
        "సగటు",
        "మంచిది",
        "చాలా బాగుంది",
        "అద్భుతమైనది",
      ];
    } else if (this.languageCode == "gu") {
      tooltips = ["સુધારણાની જરૂર છે", "સરેરાશ", "સારું", "બહુ સારું", "ઉત્તમ"];
    } else if (this.languageCode == "ml") {
      tooltips = [
        "നീഡ് മെച്ചപ്പെടുത്തൽ",
        "ശരാശരി",
        "നല്ലത്",
        "വളരെ നല്ലത്",
        "മികച്ചത്",
      ];
    } else if (this.languageCode == "pa") {
      tooltips = ["ਸੁਧਾਰ ਦੀ ਲੋੜ ਹੈ", "ਔਸਤ", "ਚੰਗਾ", "ਬਹੁਤ ਵਧੀਆ", "ਸ਼ਾਨਦਾਰ"];
    } else if (this.languageCode == "or") {
      tooltips = ["ଉନ୍ନତି ଆବଶ୍ୟକ", "ମଧ୍ୟମ", "ଭଲ", "ବହୁତ ଭଲ", "ଉତ୍କୃଷ୍ଟ"];
    } else if (this.languageCode == "asm") {
      tooltips = ["উন্নতিৰ প্ৰয়োজন","গড়","ভাল","বহুত ভাল","অতি উত্তম"];
    }

    this.conversations[idx].rating = tooltips[e - 1];
  }

  selectRating(e, idx, conversation) {
    let feedback;
    let tooltips = [
      "Need_improvement",
      "Average",
      "Good",
      "Very_good",
      "Excellent",
    ];

    feedback = tooltips[e - 1];

    if (e <= 3) {
      this.conversations[idx].comment = true;
    }

    this.endFlow_like(conversation, feedback);
    this.conversations[idx].disableRating = true;
  }

  getOptionMessage(reply) {
    if (this.languageCode == "en") {
      if (reply == "<p><strong>Select one of the options below</strong></p>") {
        return "Select one of the options below";
      }
      if (reply == "<p><strong>Please select your category</strong></p>") {
        return "Please select your category";
      }

      if (reply == "<p><strong>Do you have any other query?</strong></p>") {
        return "Do you have any other query?";
      }

      if (reply == "<p><strong>Please select your query</strong></p>") {
        return "Please select your query";
      } else {
        return "Select one of the options below";
      }
    } else if (this.languageCode == "hi") {
      if (reply == "<p><strong>कृपया अपना विकल्प चुनें</strong></p>") {
        return "कृपया अपना विकल्प चुनें";
      }
      if (reply == "<p><strong>कृपया अपना प्रश्न चुनें</strong></p>") {
        return "कृपया अपना प्रश्न चुनें";
      }
      if (reply == "<p><strong>कृपया अपनी श्रेणी चुनें</strong></p>") {
        return "कृपया अपनी श्रेणी चुनें";
      }

      if (
        reply == "<p><strong>क्या आप कोई और सवाल पूछना चाहते हैं?</strong></p>"
      ) {
        return "क्या आप कोई और सवाल पूछना चाहते हैं?";
      }

      if (reply == "<p><strong>कृपया अपना प्रष्न चुनें।</strong></p>") {
        return "कृपया अपना प्रष्न चुनें।";
      } else {
        return "कृपया अपना विकल्प चुनें";
      }
    } else if (this.languageCode == "mr") {
      if (reply == "<p><strong>खालील पर्यायांपैकी एक निवडा</strong></p>") {
        return "खालील पर्यायांपैकी एक निवडा";
      }
      if (reply == "<p><strong>कृपया तुमची श्रेणी निवडा</strong></p>") {
        return "कृपया तुमची श्रेणी निवडा";
      }

      if (
        reply == "<p><strong>तुम्हाला इतर काही प्रश्न आहेत का?</strong></p>"
      ) {
        return "तुम्हाला इतर काही प्रश्न आहेत का?";
      }

      if (reply == "<p><strong>कृपया तुमची प्रश्न निवडा</strong></p>") {
        return "कृपया तुमची प्रश्न निवडा";
      } else {
        return "खालील पर्यायांपैकी एक निवडा";
      }
    } else if (this.languageCode == "kn") {
      if (
        reply == "<p><strong>ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ</strong></p>"
      ) {
        return "ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ";
      }
      if (reply == "<p><strong>ಕೃಪಯಾ ತುಮಚಿ ಶ್ರೇಣಿ ನಿವಡಾ</strong></p>") {
        return "ಕೃಪಯಾ ತುಮಚಿ ಶ್ರೇಣಿ ನಿವಡಾ";
      }

      if (
        reply ==
        "<p><strong>ನೀವು ಬೇರೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಹೊಂದಿದ್ದೀರಾ?</strong></p>"
      ) {
        return "ನಿಮಗೆ ಬೇರೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಇದೆಯೇ?";
      }

      if (
        reply == "<p><strong>ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</strong></p>"
      ) {
        return "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ";
      } else {
        return "ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ";
      }
    } else if (this.languageCode == "ta") {
      if (
        reply ==
        "<p><strong>கீழே உள்ள விருப்பங்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்</strong></p>"
      ) {
        return "கீழே உள்ள விருப்பங்களில் ஒன்றைத் தேர்ந்தெடு";
      }
      if (
        reply ==
        "<p><strong>தயவுசெய்து உங்கள் வகையைத் தேர்ந்தெடுக்கவும்</strong></p>"
      ) {
        return "தயவுசெய்து உங்கள் வகையைத் தேர்ந்தெடுக்கவும்";
      }

      if (reply == "<p><strong>வேறு ஏதேனும் கேள்வி உள்ளதா?</strong></p>") {
        return "உங்களிடம் வேறு ஏதேனும் கேள்வி உள்ளதா?";
      }

      if (
        reply == "<p><strong>உங்கள் வினவலைத் தேர்ந்தெடுக்கவும்</strong></p>"
      ) {
        return "தயவுசெய்து உங்கள் வினவலைத் தேர்ந்தெடுக்கவும்";
      } else {
        return "கீழே உள்ள விருப்பங்களில் ஒன்றைத் தேர்ந்தெடு";
      }
    } else if (this.languageCode == "bn") {
      if (
        reply ==
        "<p><strong>নীচের বিকল্পগুলির মধ্যে একটি নির্বাচন করুন</strong></p>"
      ) {
        return "নীচের বিকল্পগুলির মধ্যে একটি নির্বাচন করুন";
      }
      if (
        reply == "<p><strong>অনুগ্রহ করে আপনার বিভাগ নির্বাচন করুন</strong></p>"
      ) {
        return "অনুগ্রহ করে আপনার বিভাগ নির্বাচন করুন";
      }

      if (reply == "<p><strong>আপনার কি অন্য কোন প্রশ্ন আছে?</strong></p>") {
        return "আপনার কি অন্য কোন প্রশ্ন আছে?";
      }

      if (
        reply ==
        "<p><strong>অনুগ্রহ করে আপনার প্রশ্ন নির্বাচন করুন</strong></p>"
      ) {
        return "আপনার ক্যোয়ারী নির্বাচন করুন";
      } else {
        return "নীচের বিকল্পগুলির মধ্যে একটি নির্বাচন করুন";
      }
    } else if (this.languageCode == "te") {
      if (
        reply == "<p><strong>దిగువ ఎంపికలలో ఒకదాన్ని ఎంచుకోండి</strong></p>"
      ) {
        return "దిగువ ఎంపికలలో ఒకదాన్ని ఎంచుకోండి";
      }
      if (reply == "<p><strong>దయచేసి మీ వర్గాన్ని ఎంచుకోండి</strong></p>") {
        return "దయచేసి మీ వర్గాన్ని ఎంచుకోండి";
      }

      if (reply == "<p><strong>మీకు ఏదైనా ఇతర ప్రశ్న ఉందా?</strong></p>") {
        return "మీకు ఏదైనా ఇతర ప్రశ్న ఉందా?";
      }

      if (reply == "<p><strong>దయచేసి మీ ప్రశ్నను ఎంచుకోండి</strong></p>") {
        return "దయచేసి మీ ప్రశ్నను ఎంచుకోండి";
      } else {
        return "దిగువ ఎంపికలలో ఒకదాన్ని ఎంచుకోండి";
      }
    } else if (this.languageCode == "gu") {
      if (reply == "<p><strong>નીચેના વિકલ્પોમાંથી એક પસંદ કરો</strong></p>") {
        return "નીચેના વિકલ્પોમાંથી એક પસંદ કરો";
      }
      if (reply == "<p><strong>કૃપા કરીને તમારી શ્રેણી પસંદ કરો</strong></p>") {
        return "કૃપા કરીને તમારી શ્રેણી પસંદ કરો";
      }

      if (reply == "<p><strong>કૃપા કરીને તમારી ક્વેરી પસંદ કરો</strong></p>") {
        return "શું તમારી પાસે બીજી કોઈ ક્વેરી છે?";
      }

      if (reply == "<p><strong>કૃપા કરીને તમારી ક્વેરી પસંદ કરો</strong></p>") {
        return "કૃપા કરીને તમારી ક્વેરી પસંદ કરો";
      } else {
        return "નીચેના વિકલ્પોમાંથી એક પસંદ કરો";
      }
    } else if (this.languageCode == "ml") {
      if (
        reply ==
        "<p><strong>ചുവടെയുള്ള ഓപ്ഷനുകളിലൊന്ന് തിരഞ്ഞെടുക്കുക</strong></p>"
      ) {
        return "ചുവടെയുള്ള ഓപ്ഷനുകളിലൊന്ന് തിരഞ്ഞെടുക്കുക";
      }
      if (
        reply ==
        "<p><strong>ദയവായി നിങ്ങളുടെ വിഭാഗം തിരഞ്ഞെടുക്കുക</strong></p>"
      ) {
        return "ദയവായി നിങ്ങളുടെ വിഭാഗം തിരഞ്ഞെടുക്കുക";
      }

      if (
        reply ==
        "<p><strong>നിങ്ങൾക്ക് മറ്റെന്തെങ്കിലും ചോദ്യമുണ്ടോ?</strong></p>"
      ) {
        return "നിങ്ങൾക്ക് മറ്റെന്തെങ്കിലും ചോദ്യമുണ്ടോ?";
      }

      if (
        reply ==
        "<p><strong>ദയവായി നിങ്ങളുടെ ചോദ്യം തിരഞ്ഞെടുക്കുക</strong></p>"
      ) {
        return "ദയവായി നിങ്ങളുടെ ചോദ്യം തിരഞ്ഞെടുക്കുക";
      } else {
        return "ചുവടെയുള്ള ഓപ്ഷനുകളിലൊന്ന് തിരഞ്ഞെടുക്കുക";
      }
    } else if (this.languageCode == "pa") {
      if (
        reply == "<p><strong>ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਇੱਕ ਚੁਣੋ</strong></p>"
      ) {
        return "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਇੱਕ ਚੁਣੋ";
      }
      if (reply == "<p><strong>ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਸ਼੍ਰੇਣੀ ਚੁਣੋ</strong></p>") {
        return "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਸ਼੍ਰੇਣੀ ਚੁਣੋ";
      }

      if (
        reply == "<p><strong>ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਕੋਈ ਹੋਰ ਪੁੱਛਗਿੱਛ ਹੈ?</strong></p>"
      ) {
        return "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਕੋਈ ਹੋਰ ਪੁੱਛਗਿੱਛ ਹੈ?";
      }

      if (reply == "<p><strong>ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਚੁਣੋ</strong></p>") {
        return "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਚੁਣੋ";
      } else {
        return "ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਇੱਕ ਦੀ ਚੋਣ ਕਰੋ";
      }
    } else if (this.languageCode == "asm") {
      if (reply == "<p><strong>তলৰ বিকল্পসমূহৰ এটা বাছক</strong></p>") {
        return "তলৰ বিকল্পসমূহৰ এটা বাছক";
      }
      if (reply == "<p><strong>অনুগ্ৰহ কৰি আপোনাৰ শ্ৰেণীটো নিৰ্বাচন কৰক</strong></p>") {
        return "অনুগ্ৰহ কৰি আপোনাৰ শ্ৰেণীটো নিৰ্বাচন কৰক";
      }

      if (reply == "<p><strong>আপোনাৰ আৰু কিবা প্ৰশ্ন আছেনে?</strong></p>") {
        return "আপোনাৰ আৰু কিবা প্ৰশ্ন আছেনে?";
      }

      if (reply == "<p><strong>অনুগ্ৰহ কৰি আপোনাৰ প্ৰশ্নটো নিৰ্বাচন কৰক</strong></p>") {
        return "অনুগ্ৰহ কৰি আপোনাৰ প্ৰশ্নটো নিৰ্বাচন কৰক";
      } else {
        return "তলৰ বিকল্পসমূহৰ এটা বাছক";
      }
    } else if (this.languageCode == "or") {
      
      if (reply === "<p><strong>Select one of the options below</strong></p>") {
        return "ନିମ୍ନସ୍ଥିରୁ ଏକଟି ଚୟନ କରନ୍ତୁ";
    }
    if (reply === "<p><strong>Please select your category</strong></p>") {
        return "ଦୟାକରି ଆପଣଙ୍କ ବର୍ଗ ଚୟନ କରନ୍ତୁ";
    }
    if (reply === "<p><strong>Do you have any other query?</strong></p>") {
        return "ଆପଣଙ୍କୁ ଅନ୍ୟ କିମ୍ବା ପ୍ରଶ୍ନ ଆସୁଛି?";
    }
    if (reply === "<p><strong>Please select your query</strong></p>") {
        return "ଦୟାକରି ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଚୟନ କରନ୍ତୁ";
    } else {
        return "ନିମ୍ନସ୍ଥିରୁ ଏକଟି ଚୟନ କରନ୍ତୁ";
    }
    }
    return reply;
  }

  autoriseBot(value, label, toggle, labelCode) {
    if (toggle) {
      return;
    }

    if (labelCode == "Abort") {
      clearInterval(this.widgetInterval);
      this.widgetIntervalCount = 7;
      this.autoriseBotToggle = true;
    }
    this.autoriseBotToggle = true;
    console.log(label);
    this.apiservice.userQuerySend(value, 3, label, 1, null);
  }

  getSelectedCategory(value, label) {
    let items = [
      {
        label: "Credit/Debit Card",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.1",
      },
      {
        label: "AePS/Aadhar Based Transactions",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.2",
      },
      {
        label: "UPI/BHIM UPI",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.3",
      },
      {
        label: "IMPS",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4",
      },
      {
        label: "NETC/FASTag",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.5",
      },
      {
        label: "NEFT/RTGS",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6",
      },
      {
        label: "ATM",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.7",
      },
      {
        label: "Prepaid Card/PPI Wallet",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.8",
      },

      {
        label: "क्रेडिट/डेबिट कार्ड",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.1",
      },
      {
        label: "ए ई पी एस/आधार ट्रांसक्शन ",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.2",
      },
      {
        label: "यू पी आई/भीम यू पी आई",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.3",
      },
      {
        label: "आई एम पी एस",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4",
      },
      {
        label: "एन ई टी सी/फास्टैग",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.5",
      },
      {
        label: "एन ई एफ टी/आर टी जी एस",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6",
      },
      {
        label: "ए टी एम",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.7",
      },
      {
        label: "प्रीपेड कार्ड/पी पी आई वॉलेट",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.8",
      },

      {
        label: "ಕ್ರೆಡಿಟ್/ಡೆಬಿಟ್ ಕಾರ್ಡ್",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.1",
      },
      {
        label: "AePS/ಆಧಾರ್ ಆಧಾರಿತ ವಹಿವಾಟುಗಳು",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.2",
      },
      {
        label: "UPI/BHIM UPI",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.3",
      },
      {
        label: "ಐ ಎಂ ಪಿ ಎಸ್",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4",
      },
      {
        label: "ಎನ್ ಇ ಟಿ ಸಿ/ಫಾಸ್ಟ್ಯಾಗ್",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.5",
      },
      {
        label: "ಎನ್ ಇ ಎಫ್ ಟಿ /ಆರ್ ಟಿ ಜಿ ಎಸ್",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6",
      },
      {
        label: "ಎಟಿಎಂ",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.7",
      },
      {
        label: "ಪ್ರಿಪೇಯ್ಡ್ ಕಾರ್ಡ್/ಪಿಪಿಐ ವಾಲೆಟ್",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.8",
      },
      {
        label: "क्रेडिट/डेबिट कार्ड",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.1",
      },
      {
        label: "AePS/आधार आधारित व्यवहार",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.2",
      },
      {
        label: "UPI/BHIM UPI",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.3",
      },
      {
        label: "आय एम पी एस",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4",
      },
      {
        label: "NETC/FASTag",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.5",
      },
      {
        label: "NEFT/RTGS",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6",
      },
      {
        label: "एटीएम",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.7",
      },
      {
        label: "प्रीपेड कार्ड/पीपीआय वॉलेट",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.8",
      },
      {
        label: "କ୍ରେଡିଟ୍/ଡେବିଟ୍ କାର୍ଡ",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.1",
      },
      {
        label: "ଏ.ଇ.ପି.ଏସ୍/ଆଧାର କାରବାରଗୁଡିକ",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.2",
      },
      {
        label: "ୟୁ.ପି.ଆଇ/ଭିମ୍ ୟୁ.ପି.ଆଇ",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.3",
      },
      {
        label: "ଆଇ.ଏମ୍.ପି.ଏସ୍",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4",
      },
      {
        label: "ଏନ୍.ଇ.ଟି.ଏସ୍/ଫାଷ୍ଟ୍‌ଟ୍ୟାଗ୍",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.5",
      },
      {
        label: "ଏନ୍.ଇ.ଏଫ୍.ଟି/ଆର୍.ଟି.ଜି.ଏସ୍",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6",
      },
      {
        label: "ଏ.ଟି.ଏମ୍",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.7",
      },
      {
        label: "ପ୍ରିପେଡ୍ କାର୍ଡ/ପି.ପି.ଆଇ/ୱଲେଟ୍",
        value: "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.8",
      },
    ];

    items.forEach((element) => {
      if (element.label == label) {
        this.selectedCategory = { label: element.label, value: element.value };
        // this.apiservice.getCategorySuggestion(element.label);
      }
    });

    if (label == "Yes (Other Product or Service)") {
      // this.apiservice.getAll();
    }
  }

  // [
  //    {
  //      "label": "it/Debit Card",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.1"
  //    },
  //    {
  //      "label": "AePS/Aadhar Based Transactions",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.2"
  //    },
  //    {
  //      "label": "UPI/BHIM UPI",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.3"
  //    },
  //    {
  //      "label": "IMPS",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4"
  //    },
  //    {
  //      "label": "NETC/FASTag",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.5"
  //    },
  //    {
  //      "label": "NEFT/RTGS",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6"
  //    },
  //    {
  //      "label": "ATM",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.7"
  //    },
  //    {
  //      "label": "Prepaid Card/PPI Wallet",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.8"
  //    },
  //    {
  //      "label": "Get Bank/Institution contact details",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.9"
  //    },
  //    {
  //      "label": "Any other Product or service",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.10"
  //    }
  //  ]

  // [
  //    {
  //      "label": "क्रेडिट/डेबिट कार्ड",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.1"
  //    },
  //    {
  //      "label": "ए ई पी एस/आधार ट्रांसक्शन ",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.2"
  //    },
  //    {
  //      "label": "यू पी आई/भीम यू पी आई",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.3"
  //    },
  //    {
  //      "label": "आई एम पी एस",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.4"
  //    },
  //    {
  //      "label": "एन ई टी सी/फास्टैग",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.5"
  //    },
  //    {
  //      "label": "एन ई एफ टी/आर टी जी एस",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.6"
  //    },
  //    {
  //      "label": "ए टी एम",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.7"
  //    },
  //    {
  //      "label": "प्रीपेड कार्ड/पी पी आई वॉलेट",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.8"
  //    },
  //    {
  //      "label": "बैंक/संस्थान संपर्क विवरण प्राप्त करें",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.9"
  //    },
  //    {
  //      "label": "कोई और सवाल",
  //      "value": "84306840-fe83-4d11-a705-c2d6bbe9eb58,1.1.10"
  //    }
  //  ]

  endFlow_like(data, feedback) {
    this.payload = {
      answerId: data.answerId,
      feedback: feedback,
      comment: null,
      userToken: data.userToken,
    };
    // console.log(this.payload);
    this.Disflg = false;
    this.apiservice.feedBack(this.payload).subscribe((data: any) => {});
    this.feedflg = true;
    const comment = Array.from(
      document.getElementsByClassName("comment") as HTMLCollectionOf<
        HTMLElement
      >
    );
    if (comment != null) {
      comment.forEach((feed) => (feed.style.display = "none"));
    }
    setTimeout(() => {
      this.feedflg = false;
      this.userQuery = "";

      setTimeout(() => {
        this.feedbackoptions = !this.feedbackoptions;
        // console.log("feedback");
      }, 2000);
    }, 3000);
  }

  convertNumber(string) {
    let regex = /(?:[-+() ]*\d){10,13}/g;

    if (!regex.test(string)) {
      return string;
    }

    let numberMatches = string.match(regex).map(Number);

    numberMatches.forEach((element) => {
      string = string.replace(
        element.toString(),
        `<a href='tel:${element}'>${element}</a>`
      );
    });

    return string;

    // s = s.replace(m[0], `<a href='tel:${m[0]}>${m[0]}</a>'`);
  }

  convertEmail(string) {
    let regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

    if (!regex.test(string)) {
      return string;
    }

    let numberMatches = string.match(regex).map(String);

    numberMatches.forEach((element) => {
      string = string.replace(
        element.toString(),
        `<a href='mailto: ${element}'>${element}</a>`
      );
    });

    return string;
  }

  convertURL(string) {
    let regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    if (!regex.test(string)) {
      return string;
    }

    let numberMatches = string.match(regex).map(String);

    numberMatches.forEach((element) => {
      string = string.replace(
        element.toString(),

        `<a href='${element}' target='_blank'>${element}</a>`
      );
    });

    return string;
  }

  getNearestQuestionArray(data) {
    if (this.restItems === null) {
      return [];
    }
    var b = this.restItems.map((str, index) => ({
      id: index + 1,
      name: str,
    }));

    let miniSearch = new MiniSearch({
      fields: ["name"],
      storeFields: ["name"],
      searchOptions: {
        boost: { name: 2 },
        fuzzy: 1,
      },
    });

    miniSearch.addAll(b);

    let results = miniSearch.search(data);

    return results;
  }

  toggleRelatedQuery(idx) {
    this.conversations[idx].showRelatedQuery = !this.conversations[idx]
      .showRelatedQuery;
  }

  quickLink(label) {
    this.apiservice.userQuerySend(label, 1, null, 1, null);
  }

  stopVideo() {
    const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
    });
    this.autoplayEnabled = false;
  }

  
  generativeAi(query) {
    this.apiservice.userQuerySend(query, 1, null, 1, null);
  }
    @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.lanBtn');
    
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation(); // Prevent immediate closing
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}