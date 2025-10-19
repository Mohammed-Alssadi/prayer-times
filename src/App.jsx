import {
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect } from 'react';
import Prayar from './ui/Prayar';
import "@fontsource/cairo";
import {
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css'; // إذا لم تكن مضافة في المشروع
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
// 🕒 تحويل من 24 إلى 12 ساعة
function formatTimeTo12Hour(time24) {
  if (!time24) return "";
  let [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "م" : "ص";
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Theme
const theme = createTheme({
  typography: { fontFamily: ["Cairo", "sans-serif"].join(",") },
});
function App() {
const cities = [
  { name: "صنعاء", value: "sanaa" },
  { name: "عدن", value: "aden" },
  { name: "تعز", value: "taiz" },
  { name: "الحديدة", value: "hodeidah" },
  { name: "إب", value: "ibb" },
  { name: "الضالع", value: "dhamar" },
  { name: "ذمار", value: "dhale" },
  { name: "لحج", value: "lahj" },
  { name: "أبين", value: "abyan" },
  { name: "شبوة", value: "shabwah" },
  { name: "الجوف", value: "aljawf" },
  { name: "عمران", value: "amran" },
  { name: "حضرموت", value: "hadramaut" },
  { name: "المهرة", value: "almahrah" },
  { name: "مارب", value: "marib" },
  { name: "صعدة", value: "saada" },
  { name: "حجة", value: "hajjah" },
  { name: "ريمة", value: "raymah" },
  { name: "المحويت", value: "almahweet" },
  { name: "البيضاء", value: "albayda" },
 

];
  const isMobile = useMediaQuery("(max-width:600px)"); 

  const [clock, setClock] = useState("");
  const [selectedCity, setSelectedCity] = useState("sanaa");
  const [timePrayar, setTimePrayar] = useState({});
  const [dateday, setdateday] = useState("");
  const [hijriDate, setHijriData] = useState({
    name: "",
    day: "",
    month: "",
    year: "",
  });


  useEffect(() => {
    const updateClock = () => {
      const currentTime = new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setClock(currentTime);
    };

    // تحديث الساعة كل ثانية
    const intervalId = setInterval(updateClock, 1000);

    // تنظيف الـ interval عند إلغاء التركيب
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const getPrayarTime = async () => {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity}&country=YE&method=2`
        );
        const dataPrayar = await response.json();
        if (dataPrayar.code === 200) {
          setTimePrayar(dataPrayar.data.timings);

          // تحويل dd-mm-yyyy إلى تاريخ ثم تنسيق بالعربية
          const [d, m, y] = dataPrayar.data.date.gregorian.date.split("-");
          const greg = new Date(`${y}-${m}-${d}`);
          setdateday(greg.toLocaleDateString("ar-EG"));
          setHijriData({
            day: dataPrayar.data.date.hijri.day,
            name: dataPrayar.data.date.hijri.weekday.ar,
            month: dataPrayar.data.date.hijri.month.ar,
            year: dataPrayar.data.date.hijri.year,
          });

        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    getPrayarTime();
  }, [selectedCity, clock]);
const cityOptions = cities.map(c => ({ label: c.name, value: c.value }));
  return (
    <>
      <ThemeProvider theme={theme}>
        <section className={isMobile ? "pt-1 " : "mt-5 pt-5"}>
          <div className="container min">
            <h1 className={isMobile ? "text-center mb-4 pt-5 title " : " text-center mb-4 pt-3 title"}>مواقيت الصلاة في اليمن</h1>
            <div className="top-section pt-3">
              <div className={isMobile ? "row flex-column text-center" : "row align-items-center"}>

                {/* المدينة */}
                <div className={isMobile ? "col-12 mb-5" : "col-4"}>
                           <div className="city text-center">
                      <h3 className="mb-3 fw-bold text-center ">المدينة</h3>

                    
                      <Dropdown
                        value={selectedCity}
                        options={cityOptions}
                        onChange={(e) => setSelectedCity(e.value)}
                        optionLabel="label"
                        placeholder="اختر المدينة"
                        virtualScrollerOptions={{ itemSize: 44 }} // يجعل القائمة قابلة للتمرير بكفاءة لو كثيرة
                        style={{ width: 170, textAlign: 'center', direction: 'rtl',marginTop: '0px', backdropFilter: 'blur(2px)', background: 'rgba(255, 255, 255, 0.1)',color: 'white',borderRadius: '15px' }} // ضبط العرض والمحاذاة والاتجاه
                        panelStyle={{ direction: 'rtl' }} // يضمن أن قائمة الخيارات تظهر منسقة RTL
                          panelClassName="rtl-dropdown"
                        className="text-center city-dropdown"
                        
                      />
                    </div>
                </div>

                {/* الوقت الآن */}
                <div className={isMobile ? "col-12 mb-5" : "col-4"}>
                  <div className="time text-center">
                    <h3 className="mb-3  fw-bold pb-2">الوقت الآن</h3>
                    <h2 className="pb-3 mb-3 ">
                      {clock}
                    </h2>
                  </div>
                </div>

                {/* التاريخ */}
                <div className={isMobile ? "col-12 mb-3" : "col-4"}>
                  <div className="date text-center">
                    <h3 className="mb-3 fw-bold">التاريخ</h3>
                    <h4 dir="rtl">{dateday}</h4>
                    <h5>
                      {hijriDate.name} {hijriDate.day} {hijriDate.month} {hijriDate.year}
                    </h5>

                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <div className="prayar-section">
              <Prayar name="الفجر" time={formatTimeTo12Hour(timePrayar.Fajr)} />
              <Prayar name="الظهر" time={formatTimeTo12Hour(timePrayar.Dhuhr)} />
              <Prayar name="العصر" time={formatTimeTo12Hour(timePrayar.Asr)} />
              <Prayar name="المغرب" time={formatTimeTo12Hour(timePrayar.Maghrib)} />
              <Prayar name="العشاء" time={formatTimeTo12Hour(timePrayar.Isha)} />
            </div>
            <hr className="my-4" />
            <div className="last-section">
              <p className="text-center mt-2 pb-3">تصميم وتطوير: [محمد السعدي]</p>
            </div>
          </div>
        </section>
      </ThemeProvider>
    </>
  );
}

export default App;
