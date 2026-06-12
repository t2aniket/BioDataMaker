const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
fs.mkdirSync(localesDir, { recursive: true });

const baseKeys = {
  personalDetails: "Personal Details",
  fullName: "Full Name",
  gender: "Gender",
  dob: "Date of Birth",
  birthTime: "Birth Time",
  birthPlace: "Birth Place",
  height: "Height",
  weight: "Weight",
  bloodGroup: "Blood Group",
  complexion: "Complexion",
  religion: "Religion",
  caste: "Caste",
  subCaste: "Sub-caste",
  gotra: "Gotra",
  nakshatra: "Nakshatra",
  rashi: "Rashi",
  manglik: "Manglik",
  maritalStatus: "Marital Status",
  motherTongue: "Mother Tongue",

  educationCareer: "Education and Career",
  education: "Education",
  occupation: "Occupation",
  companyBusiness: "Company / Business",
  annualIncome: "Annual Income",
  workLocation: "Work Location",

  familyDetails: "Family Details",
  fatherName: "Father's Name",
  fatherOccupation: "Father's Occupation",
  motherName: "Mother's Name",
  motherOccupation: "Mother's Occupation",
  brothers: "Brothers",
  sisters: "Sisters",
  familyType: "Family Type",
  nativePlace: "Native Place",
  currentAddress: "Current Address",

  partnerExpectations: "Partner Expectations",
  expectedEducation: "Expected Education",
  expectedOccupation: "Expected Occupation",
  expectedLocation: "Expected Location",
  otherExpectations: "Other Expectations",

  contactDetails: "Contact Details",
  contactPerson: "Contact Person",
  mobileNumber: "Mobile Number",
  email: "Email",
  address: "Address",

  other: "Other",
  aboutMe: "About Me",
  hobbies: "Hobbies",
  additionalInfo: "Additional Information",

  ui: {
    selectLanguage: "Select Language",
    popular: "Popular",
    next: "Next",
    back: "Back",
    submit: "Generate Biodata",
    preview: "Preview",
    download: "Download"
  }
};

const translations = {
  en: baseKeys,
  hi: {
    personalDetails: "व्यक्तिगत विवरण", fullName: "पूरा नाम", gender: "लिंग", dob: "जन्म तिथि", birthTime: "जन्म समय", birthPlace: "जन्म स्थान", height: "ऊंचाई", weight: "वजन", bloodGroup: "रक्त समूह", complexion: "रंग", religion: "धर्म", caste: "जाति", subCaste: "उप-जाति", gotra: "गोत्र", nakshatra: "नक्षत्र", rashi: "राशि", manglik: "मांगलिक", maritalStatus: "वैवाहिक स्थिति", motherTongue: "मातृभाषा",
    educationCareer: "शिक्षा और करियर", education: "शिक्षा", occupation: "व्यवसाय", companyBusiness: "कंपनी / व्यवसाय", annualIncome: "वार्षिक आय", workLocation: "कार्य स्थल",
    familyDetails: "पारिवारिक विवरण", fatherName: "पिता का नाम", fatherOccupation: "पिता का व्यवसाय", motherName: "माता का नाम", motherOccupation: "माता का व्यवसाय", brothers: "भाई", sisters: "बहनें", familyType: "परिवार का प्रकार", nativePlace: "मूल स्थान", currentAddress: "वर्तमान पता",
    partnerExpectations: "साथी से अपेक्षाएं", expectedEducation: "अपेक्षित शिक्षा", expectedOccupation: "अपेक्षित व्यवसाय", expectedLocation: "अपेक्षित स्थान", otherExpectations: "अन्य अपेक्षाएं",
    contactDetails: "संपर्क विवरण", contactPerson: "संपर्क व्यक्ति", mobileNumber: "मोबाइल नंबर", email: "ईमेल", address: "पता",
    other: "अन्य", aboutMe: "मेरे बारे में", hobbies: "शौक", additionalInfo: "अतिरिक्त जानकारी",
    ui: { selectLanguage: "भाषा चुनें", popular: "लोकप्रिय", next: "अगला", back: "पीछे", submit: "बायोडाटा बनाएं", preview: "पूर्वावलोकन", download: "डाउनलोड करें" }
  },
  mr: {
    personalDetails: "वैयक्तिक माहिती", fullName: "पूर्ण नाव", gender: "लिंग", dob: "जन्म तारीख", birthTime: "जन्म वेळ", birthPlace: "जन्म ठिकाण", height: "उंची", weight: "वजन", bloodGroup: "रक्तगट", complexion: "रंग", religion: "धर्म", caste: "जात", subCaste: "उपजात", gotra: "गोत्र", nakshatra: "नक्षत्र", rashi: "रास", manglik: "मांगलिक", maritalStatus: "वैवाहिक स्थिती", motherTongue: "मातृभाषा",
    educationCareer: "शिक्षण आणि व्यवसाय", education: "शिक्षण", occupation: "व्यवसाय", companyBusiness: "कंपनी / व्यवसाय", annualIncome: "वार्षिक उत्पन्न", workLocation: "कामाचे ठिकाण",
    familyDetails: "कौटुंबिक माहिती", fatherName: "वडिलांचे नाव", fatherOccupation: "वडिलांचा व्यवसाय", motherName: "आईचे नाव", motherOccupation: "आईचा व्यवसाय", brothers: "भाऊ", sisters: "बहीण", familyType: "कुटुंबाचा प्रकार", nativePlace: "मूळ गाव", currentAddress: "सध्याचा पत्ता",
    partnerExpectations: "जोडीदाराकडून अपेक्षा", expectedEducation: "अपेक्षित शिक्षण", expectedOccupation: "अपेक्षित व्यवसाय", expectedLocation: "अपेक्षित ठिकाण", otherExpectations: "इतर अपेक्षा",
    contactDetails: "संपर्क माहिती", contactPerson: "संपर्क व्यक्ती", mobileNumber: "मोबाईल नंबर", email: "ईमेल", address: "पत्ता",
    other: "इतर", aboutMe: "माझ्याबद्दल", hobbies: "छंद", additionalInfo: "अतिरिक्त माहिती",
    ui: { selectLanguage: "भाषा निवडा", popular: "लोकप्रिय", next: "पुढे", back: "मागे", submit: "बायोडाटा बनवा", preview: "पूर्वावलोकन", download: "डाउनलोड करा" }
  },
  gu: {
    personalDetails: "વ્યક્તિગત માહિતી", fullName: "પૂરું નામ", gender: "લિંગ", dob: "જન્મ તારીખ", birthTime: "જન્મ સમય", birthPlace: "જન્મ સ્થળ", height: "ઊંચાઈ", weight: "વજન", bloodGroup: "રક્ત જૂથ", complexion: "રંગ", religion: "ધર્મ", caste: "જાતિ", subCaste: "પેટા-જાતિ", gotra: "ગોત્ર", nakshatra: "નક્ષત્ર", rashi: "રાશિ", manglik: "માંગલિક", maritalStatus: "વૈવાહિક સ્થિતિ", motherTongue: "માતૃભાષા",
    educationCareer: "શિક્ષણ અને કારકિર્દી", education: "શિક્ષણ", occupation: "વ્યવસાય", companyBusiness: "કંપની / વ્યવસાય", annualIncome: "વાર્ષિક આવક", workLocation: "કામનું સ્થળ",
    familyDetails: "પારિવારિક માહિતી", fatherName: "પિતાનું નામ", fatherOccupation: "પિતાનો વ્યવસાય", motherName: "માતાનું નામ", motherOccupation: "માતાનો વ્યવસાય", brothers: "ભાઈઓ", sisters: "બહેનો", familyType: "પરિવારનો પ્રકાર", nativePlace: "મૂળ વતન", currentAddress: "વર્તમાન સરનામું",
    partnerExpectations: "જીવનસાથી પાસે અપેક્ષાઓ", expectedEducation: "અપેક્ષિત શિક્ષણ", expectedOccupation: "અપેક્ષિત વ્યવસાય", expectedLocation: "અપેક્ષિત સ્થળ", otherExpectations: "અન્ય અપેક્ષાઓ",
    contactDetails: "સંપર્ક માહિતી", contactPerson: "સંપર્ક વ્યક્તિ", mobileNumber: "મોબાઇલ નંબર", email: "ઇમેઇલ", address: "સરનામું",
    other: "અન્ય", aboutMe: "મારા વિશે", hobbies: "શોખ", additionalInfo: "વધારાની માહિતી",
    ui: { selectLanguage: "ભાષા પસંદ કરો", popular: "લોકપ્રિય", next: "આગળ", back: "પાછળ", submit: "બાયોડેટા બનાવો", preview: "પૂર્વાવલોકન", download: "ડાઉનલોડ કરો" }
  },
  ta: {
    personalDetails: "தனிப்பட்ட விவரங்கள்", fullName: "முழு பெயர்", gender: "பாலினம்", dob: "பிறந்த தேதி", birthTime: "பிறந்த நேரம்", birthPlace: "பிறந்த இடம்", height: "உயரம்", weight: "எடை", bloodGroup: "இரத்த வகை", complexion: "நிறம்", religion: "மதம்", caste: "சாதி", subCaste: "உட்பிரிவு", gotra: "கோத்திரம்", nakshatra: "நட்சத்திரம்", rashi: "ராசி", manglik: "செவ்வாய் தோஷம்", maritalStatus: "திருமண நிலை", motherTongue: "தாய்மொழி",
    educationCareer: "கல்வி மற்றும் தொழில்", education: "கல்வி", occupation: "தொழில்", companyBusiness: "நிறுவனம் / வியாபாரம்", annualIncome: "ஆண்டு வருமானம்", workLocation: "பணிபுரியும் இடம்",
    familyDetails: "குடும்ப விவரங்கள்", fatherName: "தந்தையின் பெயர்", fatherOccupation: "தந்தையின் தொழில்", motherName: "தாயின் பெயர்", motherOccupation: "தாயின் தொழில்", brothers: "சகோதரர்கள்", sisters: "சகோதரிகள்", familyType: "குடும்ப வகை", nativePlace: "பூர்வீகம்", currentAddress: "தற்போதைய முகவரி",
    partnerExpectations: "துணையிடம் எதிர்பார்ப்புகள்", expectedEducation: "எதிர்பார்க்கும் கல்வி", expectedOccupation: "எதிர்பார்க்கும் தொழில்", expectedLocation: "எதிர்பார்க்கும் இடம்", otherExpectations: "பிற எதிர்பார்ப்புகள்",
    contactDetails: "தொடர்பு விவரங்கள்", contactPerson: "தொடர்பு நபர்", mobileNumber: "மொபைல் எண்", email: "மின்னஞ்சல்", address: "முகவரி",
    other: "மற்றவை", aboutMe: "என்னை பற்றி", hobbies: "பொழுதுபோக்குகள்", additionalInfo: "கூடுதல் தகவல்",
    ui: { selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்", popular: "பிரபலமானவை", next: "அடுத்து", back: "பின்னால்", submit: "பயோடேட்டா உருவாக்கு", preview: "முன்னோட்டம்", download: "பதிவிறக்கம்" }
  },
  te: {
    personalDetails: "వ్యక్తిగత వివరాలు", fullName: "పూర్తి పేరు", gender: "లింగం", dob: "పుట్టిన తేదీ", birthTime: "పుట్టిన సమయం", birthPlace: "పుట్టిన ప్రదేశం", height: "ఎత్తు", weight: "బరువు", bloodGroup: "రక్త వర్గం", complexion: "రంగు", religion: "మతం", caste: "కులం", subCaste: "ఉప కులం", gotra: "గోత్రం", nakshatra: "నక్షత్రం", rashi: "రాశి", manglik: "మాంగ్లిక్", maritalStatus: "వైవాహిక స్థితి", motherTongue: "మాతృభాష",
    educationCareer: "విద్య మరియు వృత్తి", education: "విద్య", occupation: "వృత్తి", companyBusiness: "కంపెనీ / వ్యాపారం", annualIncome: "వార్షిక ఆదాయం", workLocation: "పనిచేసే ప్రదేశం",
    familyDetails: "కుటుంబ వివరాలు", fatherName: "తండ్రి పేరు", fatherOccupation: "తండ్రి వృత్తి", motherName: "తల్లి పేరు", motherOccupation: "తల్లి వృత్తి", brothers: "సోదరులు", sisters: "సోదరీమణులు", familyType: "కుటుంబ రకం", nativePlace: "స్వస్థలం", currentAddress: "ప్రస్తుత చిరునామా",
    partnerExpectations: "భాగస్వామి అంచనాలు", expectedEducation: "ఆశించే విద్య", expectedOccupation: "ఆశించే వృత్తి", expectedLocation: "ఆశించే ప్రదేశం", otherExpectations: "ఇతర అంచనాలు",
    contactDetails: "సంప్రదింపు వివరాలు", contactPerson: "సంప్రదించాల్సిన వ్యక్తి", mobileNumber: "మొబైల్ నంబర్", email: "ఈమెయిల్", address: "చిరునామా",
    other: "ఇతరాలు", aboutMe: "నా గురించి", hobbies: "అభిరుచులు", additionalInfo: "అదనపు సమాచారం",
    ui: { selectLanguage: "భాషను ఎంచుకోండి", popular: "జనాదరణ పొందినవి", next: "తదుపరి", back: "వెనుకకు", submit: "బయోడేటా సృష్టించండి", preview: "ప్రివ్యూ", download: "డౌన్‌లోడ్" }
  },
  kn: {
    personalDetails: "ವೈಯಕ್ತಿಕ ವಿವರಗಳು", fullName: "ಪೂರ್ಣ ಹೆಸರು", gender: "ಲಿಂಗ", dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ", birthTime: "ಹುಟ್ಟಿದ ಸಮಯ", birthPlace: "ಹುಟ್ಟಿದ ಸ್ಥಳ", height: "ಎತ್ತರ", weight: "ತೂಕ", bloodGroup: "ರಕ್ತದ ಗುಂಪು", complexion: "ಬಣ್ಣ", religion: "ಧರ್ಮ", caste: "ಜಾತಿ", subCaste: "ಉಪಜಾತಿ", gotra: "ಗೋತ್ರ", nakshatra: "ನಕ್ಷತ್ರ", rashi: "ರಾಶಿ", manglik: "ಮಾಂಗ್ಲಿಕ್", maritalStatus: "ವೈವಾಹಿಕ ಸ್ಥಿತಿ", motherTongue: "ಮಾತೃಭಾಷೆ",
    educationCareer: "ಶಿಕ್ಷಣ ಮತ್ತು ವೃತ್ತಿ", education: "ಶಿಕ್ಷಣ", occupation: "ವೃತ್ತಿ", companyBusiness: "ಕಂಪನಿ / ವ್ಯಾಪಾರ", annualIncome: "ವಾರ್ಷಿಕ ಆದಾಯ", workLocation: "ಕೆಲಸದ ಸ್ಥಳ",
    familyDetails: "ಕುಟುಂಬದ ವಿವರಗಳು", fatherName: "ತಂದೆಯ ಹೆಸರು", fatherOccupation: "ತಂದೆಯ ವೃತ್ತಿ", motherName: "ತಾಯಿಯ ಹೆಸರು", motherOccupation: "ತಾಯಿಯ ವೃತ್ತಿ", brothers: "ಸಹೋದರರು", sisters: "ಸಹೋದರಿಯರು", familyType: "ಕುಟುಂಬದ ಪ್ರಕಾರ", nativePlace: "ಮೂಲ ಸ್ಥಳ", currentAddress: "ಪ್ರಸ್ತುತ ವಿಳಾಸ",
    partnerExpectations: "ಪಾಲುದಾರರ ನಿರೀಕ್ಷೆಗಳು", expectedEducation: "ನಿರೀಕ್ಷಿತ ಶಿಕ್ಷಣ", expectedOccupation: "ನಿರೀಕ್ಷಿತ ವೃತ್ತಿ", expectedLocation: "ನಿರೀಕ್ಷಿತ ಸ್ಥಳ", otherExpectations: "ಇತರೆ ನಿರೀಕ್ಷೆಗಳು",
    contactDetails: "ಸಂಪರ್ಕ ವಿವರಗಳು", contactPerson: "ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ", mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", email: "ಇಮೇಲ್", address: "ವಿಳಾಸ",
    other: "ಇತರೆ", aboutMe: "ನನ್ನ ಬಗ್ಗೆ", hobbies: "ಹವ್ಯಾಸಗಳು", additionalInfo: "ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ",
    ui: { selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", popular: "ಜನಪ್ರಿಯ", next: "ಮುಂದೆ", back: "ಹಿಂದೆ", submit: "ಬಯೋಡೇಟಾ ರಚಿಸಿ", preview: "ಪೂರ್ವವೀಕ್ಷಣೆ", download: "ಡೌನ್‌ಲೋಡ್" }
  },
  bn: {
    personalDetails: "ব্যক্তিগত বিবরণ", fullName: "পুরো নাম", gender: "লিঙ্গ", dob: "জন্ম তারিখ", birthTime: "জন্মের সময়", birthPlace: "জন্মস্থান", height: "উচ্চতা", weight: "ওজন", bloodGroup: "রক্তের গ্রুপ", complexion: "গায়ের রঙ", religion: "ধর্ম", caste: "জাতি", subCaste: "উপজাতি", gotra: "গোত্র", nakshatra: "নক্ষত্র", rashi: "রাশি", manglik: "মাঙ্গলিক", maritalStatus: "বৈবাহিক অবস্থা", motherTongue: "মাতৃভাষা",
    educationCareer: "শিক্ষা এবং ক্যারিয়ার", education: "শিক্ষা", occupation: "পেশা", companyBusiness: "কোম্পানি / ব্যবসা", annualIncome: "বার্ষিক আয়", workLocation: "কর্মস্থল",
    familyDetails: "পারিবারিক বিবরণ", fatherName: "বাবার নাম", fatherOccupation: "বাবার পেশা", motherName: "মায়ের নাম", motherOccupation: "মায়ের পেশা", brothers: "ভাই", sisters: "বোন", familyType: "পরিবারের ধরন", nativePlace: "দেশের বাড়ি", currentAddress: "বর্তমান ঠিকানা",
    partnerExpectations: "সঙ্গীর কাছে প্রত্যাশা", expectedEducation: "প্রত্যাশিত শিক্ষা", expectedOccupation: "প্রত্যাশিত পেশা", expectedLocation: "প্রত্যাশিত স্থান", otherExpectations: "অন্যান্য প্রত্যাশা",
    contactDetails: "যোগাযোগের বিবরণ", contactPerson: "যোগাযোগের ব্যক্তি", mobileNumber: "মোবাইল নম্বর", email: "ইমেইল", address: "ঠিকানা",
    other: "অন্যান্য", aboutMe: "আমার সম্পর্কে", hobbies: "শখ", additionalInfo: "অতিরিক্ত তথ্য",
    ui: { selectLanguage: "ভাষা নির্বাচন করুন", popular: "জনপ্রিয়", next: "পরবর্তী", back: "পিছনে", submit: "বায়োডাটা তৈরি করুন", preview: "প্রিভিউ", download: "ডাউনলোড" }
  },
  pa: {
    personalDetails: "ਨਿੱਜੀ ਵੇਰਵੇ", fullName: "ਪੂਰਾ ਨਾਮ", gender: "ਲਿੰਗ", dob: "ਜਨਮ ਤਾਰੀਖ", birthTime: "ਜਨਮ ਦਾ ਸਮਾਂ", birthPlace: "ਜਨਮ ਸਥਾਨ", height: "ਕੱਦ", weight: "ਭਾਰ", bloodGroup: "ਬਲੱਡ ਗਰੁੱਪ", complexion: "ਰੰਗ", religion: "ਧਰਮ", caste: "ਜਾਤ", subCaste: "ਗੋਤ", gotra: "ਗੋਤਰ", nakshatra: "ਨਕਸ਼ਤਰ", rashi: "ਰਾਸ਼ੀ", manglik: "ਮਾਂਗਲਿਕ", maritalStatus: "ਵਿਆਹੁਤਾ ਸਥਿਤੀ", motherTongue: "ਮਾਂ ਬੋਲੀ",
    educationCareer: "ਸਿੱਖਿਆ ਅਤੇ ਕਰੀਅਰ", education: "ਸਿੱਖਿਆ", occupation: "ਕਿੱਤਾ", companyBusiness: "ਕੰਪਨੀ / ਕਾਰੋਬਾਰ", annualIncome: "ਸਾਲਾਨਾ ਆਮਦਨ", workLocation: "ਕੰਮ ਦੀ ਥਾਂ",
    familyDetails: "ਪਰਿਵਾਰਕ ਵੇਰਵੇ", fatherName: "ਪਿਤਾ ਦਾ ਨਾਮ", fatherOccupation: "ਪਿਤਾ ਦਾ ਕਿੱਤਾ", motherName: "ਮਾਤਾ ਦਾ ਨਾਮ", motherOccupation: "ਮਾਤਾ ਦਾ ਕਿੱਤਾ", brothers: "ਭਰਾ", sisters: "ਭੈਣਾਂ", familyType: "ਪਰਿਵਾਰ ਦੀ ਕਿਸਮ", nativePlace: "ਪਿੱਤਰੀ ਪਿੰਡ", currentAddress: "ਮੌਜੂਦਾ ਪਤਾ",
    partnerExpectations: "ਜੀਵਨ ਸਾਥੀ ਤੋਂ ਉਮੀਦਾਂ", expectedEducation: "ਲੋੜੀਂਦੀ ਸਿੱਖਿਆ", expectedOccupation: "ਲੋੜੀਂਦਾ ਕਿੱਤਾ", expectedLocation: "ਲੋੜੀਂਦੀ ਥਾਂ", otherExpectations: "ਹੋਰ ਉਮੀਦਾਂ",
    contactDetails: "ਸੰਪਰਕ ਵੇਰਵੇ", contactPerson: "ਸੰਪਰਕ ਵਿਅਕਤੀ", mobileNumber: "ਮੋਬਾਈਲ ਨੰਬਰ", email: "ਈਮੇਲ", address: "ਪਤਾ",
    other: "ਹੋਰ", aboutMe: "ਮੇਰੇ ਬਾਰੇ", hobbies: "ਸ਼ੌਕ", additionalInfo: "ਵਾਧੂ ਜਾਣਕਾਰੀ",
    ui: { selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ", popular: "ਮਸ਼ਹੂਰ", next: "ਅਗਲਾ", back: "ਪਿੱਛੇ", submit: "ਬਾਇਓਡਾਟਾ ਬਣਾਓ", preview: "ਝਲਕ", download: "ਡਾਊਨਲੋਡ" }
  },
  ur: {
    personalDetails: "ذاتی تفصیلات", fullName: "پورا نام", gender: "جنس", dob: "تاریخ پیدائش", birthTime: "وقت پیدائش", birthPlace: "مقام پیدائش", height: "قد", weight: "وزن", bloodGroup: "بلڈ گروپ", complexion: "رنگت", religion: "مذہب", caste: "ذات", subCaste: "ذیلی ذات", gotra: "گوترا", nakshatra: "نکشتر", rashi: "راشی", manglik: "مانگلک", maritalStatus: "ازدواجی حیثیت", motherTongue: "مادری زبان",
    educationCareer: "تعلیم اور کیریئر", education: "تعلیم", occupation: "پیشہ", companyBusiness: "کمپنی / کاروبار", annualIncome: "سالانہ آمدنی", workLocation: "کام کی جگہ",
    familyDetails: "خاندانی تفصیلات", fatherName: "والد کا نام", fatherOccupation: "والد کا پیشہ", motherName: "والدہ کا نام", motherOccupation: "والدہ کا پیشہ", brothers: "بھائی", sisters: "بہنیں", familyType: "خاندان کی قسم", nativePlace: "آبائی علاقہ", currentAddress: "موجودہ پتہ",
    partnerExpectations: "شریک حیات سے توقعات", expectedEducation: "مطلوبہ تعلیم", expectedOccupation: "مطلوبہ پیشہ", expectedLocation: "مطلوبہ مقام", otherExpectations: "دیگر توقعات",
    contactDetails: "رابطے کی تفصیلات", contactPerson: "رابطہ شخص", mobileNumber: "موبائل نمبر", email: "ای میل", address: "پتہ",
    other: "دیگر", aboutMe: "میرے بارے میں", hobbies: "مشاغل", additionalInfo: "اضافی معلومات",
    ui: { selectLanguage: "زبان منتخب کریں", popular: "مقبول", next: "اگلا", back: "پیچھے", submit: "بائیو ڈیٹا بنائیں", preview: "پیش نظارہ", download: "ڈاؤن لوڈ کریں" }
  }
};

for (const [lang, data] of Object.entries(translations)) {
  fs.writeFileSync(path.join(localesDir, `${lang}.json`), JSON.stringify(data, null, 2));
}

console.log("Translation files generated.");
