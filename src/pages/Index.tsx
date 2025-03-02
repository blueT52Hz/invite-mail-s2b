import {
  MapPin,
  User,
  Check,
  X,
  Clock,
  Menu,
  Loader2,
  PaletteIcon,
  MapPinned,
  Eye,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const EventDetails = {
  title:
    "Thư mời Tham dự Sinh nhật\n Cộng đồng phát triển tài năng sinh viên S2B",
  date: "Thứ Bảy, ngày 15 tháng 3 năm 2025",
  time: "18:30-21:30",
  dressCode: ["#2E5077", "#000", "#fff"],
  thumbnail:
    "https://res.cloudinary.com/dt1fb17gi/image/upload/v1740893287/cover2_erm1dc.jpg",
  location: {
    name: "Tầng 11, Tòa nhà VG",
    address: "Ngõ 235 Đ. Nguyễn Trãi, Thanh Xuân Trung, Thanh Xuân, Hà Nội",
    mapUrl: "https://www.google.com/maps?cid=11743612530132812167",
  },
  timeline: [
    { time: "18:30 - 19:00", event: "Check In khách mời" },
    { time: "19:00 - 19:13", event: "Văn nghệ mở đầu và Khai mạc" },
    { time: "19:13 - 19:24", event: "Giới thiệu khách mời tham gia" },
    {
      time: "19:24 - 19:50",
      event: "Chủ nhiệm 3 CLB nhận quà và phát biểu cảm nghĩ",
    },
    { time: "19:50 - 20:25", event: "Văn nghệ và Minigame" },
    {
      time: "20:25 - 20:41",
      event: "Tri ân anh Chế Đình Sơn, Cắt bánh sinh nhật",
    },
    { time: "20:41 - 20:46", event: "Văn nghệ: Nhảy" },
    { time: "20:46 - Hết", event: "Bế mạc" },
  ],
};

interface Guest {
  name: string;
  email: string;
  confirmed: boolean;
  participating: boolean;
  club:
    | "CLB Lập Trình PTIT"
    | "CLB Multimedia PTIT"
    | "CLB Nhà Sáng Tạo Game PTIT";
}

const getTestUrrlPRO =
  "https://workflow.proptit.com/webhook-test/995de956-6bf7-49be-b6bb-46507f128709";
const getBaseUrlPRO =
  "https://workflow.proptit.com/webhook/995de956-6bf7-49be-b6bb-46507f128709";
const postBaseUrlPRO =
  "https://workflow.proptit.com/webhook/515425de-e385-4777-b05e-310fc8afbec2";
const postTestUrlPRO =
  "https://workflow.proptit.com/webhook-test/515425de-e385-4777-b05e-310fc8afbec2";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const clb = searchParams.get("club");
  const key = searchParams.get("key");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingParticipationChange, setLoadingParticipationChange] =
    useState(false);
  const [guest, setGuest] = useState<Guest>({
    name: "Không xác định",
    email: "Không xác định",
    confirmed: false,
    participating: false,
    club: "CLB Lập Trình PTIT",
  });

  useEffect(() => {
    if (!email) return; // Nếu không có email, không gọi API

    const getGuest = async () => {
      try {
        setLoading(true);
        if (guest.email === "Không xác định")
          await new Promise((resolve) => setTimeout(resolve, 2000));

        const [response] = await Promise.all([
          fetch(`${getBaseUrlPRO}?email=${email}&club=${clb}&key=${atob(key)}`),
          new Promise((resolve) =>
            setTimeout(resolve, guest.email !== "Không xác định" ? 0 : 1000)
          ), // Đảm bảo tối thiểu 1ss
        ]);

        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu");

        const data: Guest = await response.json();
        console.log(data);

        setGuest(data);
      } catch (error) {
        console.error("Lỗi:", error);
        setErrorMessage(
          "Không tìm thấy thông tin khách mời, vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    };

    getGuest();
  }, [email]);

  const handleParticipationChange = async (participating: boolean) => {
    if (participating === guest.participating) return;
    setGuest({ ...guest, participating, confirmed: true });

    if (guest.email !== "Không xác định") {
      try {
        setErrorMessage("");
        setLoadingParticipationChange(true);
        // Chạy song song fetch API và delay tối thiểu 1 giây
        const [response] = await Promise.all([
          fetch(postBaseUrlPRO, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: guest.email,
              club: clb,
              join: String(participating),
              key: atob(key),
            }),
          }),
          new Promise((resolve) => setTimeout(resolve, 1000)), // Đảm bảo tối thiểu 1s
        ]);

        const result = await response.json();
      } catch (error) {
        console.error(error);
        setErrorMessage("Có lỗi xảy ra, vui lòng thử lại!");
      } finally {
        setLoadingParticipationChange(false);
      }
    }
  };

  return (
    <div className="bg-[#00AAC4]/15">
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white min757:max-w-[757px] mx-auto shadow-2xl before:content-[''] before:absolute before:top-0 before:left-0 before:w-2 before:h-full before:bg-gradient-to-r before:from-gray-300 before:to-transparent after:content-[''] after:absolute after:top-0 after:right-0 after:w-2 after:h-full after:bg-gradient-to-l after:from-gray-300 after:to-transparent">
        {/* Hero Section with Thumbnail */}
        <section className="container mx-0 my-0 px-0 animate-fadeIn overflow-hidden">
          <div className="mb-8">
            <img
              src={"/images/cover.jpg"}
              alt="Event thumbnail"
              className="w-full rounded-lg mb-4 object-cover"
            />
            <h1 className="text-[1.5rem] md:text-4xl font-bold text-center text-event-purple mb-4 min757:px-0 px-4">
              {EventDetails.title}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-event-gray px-4 md:px-0">
              <Clock className="w-5 h-5" />
              <div className="flex flex-col min478:flex-row gap-0 min478:gap-2">
                <div>{EventDetails.date}</div>
                <div className="hidden min478:block">•</div>
                <div>{EventDetails.time}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col px-4 min757:px-10 gap-4">
          {/* Dresscode */}
          <section className="container px-0 py-0 mx-0 animate-fadeIn delay-300 -mb-4">
            <div className="flex items-center mb-4">
              <PaletteIcon className="md:w-8 md:h-8 text-event-purple" />
              <h2 className="md:text-xl text-base font-semibold text-event-purple ml-4">
                Dresscode:
              </h2>
              <div className="flex space-x-2 ml-2">
                {EventDetails.dressCode.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className="md:w-6 md:h-6 w-4 h-4 rounded-full border-black border shadow-md"
                      style={{ backgroundColor: item }}
                    ></span>
                  );
                })}
              </div>
            </div>
          </section>
          {/* Location Section */}
          <section className="container mx-0 px-0 py-0 animate-fadeIn delay-100">
            <div className="">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="block w-full hover:bg-slate-100 transition-all rounded-lg py-2 relative text-left"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-start space-x-4">
                    <MapPinned className="md:w-8 md:h-8 my-auto text-event-purple flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-event-purple text-base md:text-xl">
                        {EventDetails.location.name}
                      </h3>
                      <p className="text-event-gray mt-1 text-sm md:text-base">
                        {EventDetails.location.address}
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-6 h-6 text-event-purple" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-event-purple" />
                  )}
                </div>
              </button>

              {/* Iframe xổ xuống khi mở */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d931.1615785304035!2d105.80119727501123!3d21.0068101746111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aca166afffff%3A0x6a1ed9cc54f738d9!2zMjVUMiBQLiBOZ3V54buFbiBUaOG7iyBUaOG6rXAsIFRydW5nIEhvw6AsIEPhuqd1IEdp4bqleSwgSMOgIE7hu5lpIDEwMDAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1740836258277!5m2!1svi!2s"
                  width="100%"
                  height="450"
                  loading="lazy"
                  className="rounded-lg mt-2"
                ></iframe>
              </motion.div>
            </div>
          </section>

          {/* Guest List Section with RSVP */}
          <section className="container px-0 py-0 mx-0 animate-fadeIn delay-200">
            <div className="">
              <div className="rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <User className="md:w-8 md:h-8 text-event-purple" />
                  <h2 className="md:text-xl text-base font-semibold text-event-purple">
                    Thông tin Khách mời
                  </h2>
                </div>
                <div className="space-y-4 px-4 min478:px-14">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {/* Avatar + Name */}
                      {loading ? (
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-event-lightPurple flex items-center justify-center">
                          <span className="text-event-purple font-semibold">
                            {guest.name.split(" ").at(-1)[0]}
                          </span>
                        </div>
                      )}

                      <div>
                        {loading ? (
                          <>
                            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-40 h-4 bg-gray-200 rounded mt-1 animate-pulse"></div>
                          </>
                        ) : (
                          <>
                            <h3 className="font-medium text-event-purple">
                              {guest?.name}
                            </h3>
                            <p className="text-sm text-event-gray">
                              {guest?.email}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Trạng thái xác nhận */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-1">
                        {loading ? (
                          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                        ) : errorMessage !== "" ? (
                          <div>
                            <span className="ml-4 text-sm text-red-500">
                              {errorMessage}
                            </span>
                          </div>
                        ) : guest?.confirmed ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-event-gray">
                              Đã xác nhận
                            </span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-event-gray">
                              Chưa xác nhận
                            </span>
                          </>
                        )}
                      </div>

                      {/* Nút tham gia / vắng mặt */}
                      <div className="flex min757:gap-10 gap-2">
                        {loading ? (
                          <>
                            <div className="w-1/2 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="w-1/2 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                          </>
                        ) : (
                          <>
                            {/* Nút Tham gia */}
                            <button
                              onClick={() => handleParticipationChange(true)}
                              disabled={loadingParticipationChange} // Không bấm được khi loading
                              className={`px-2 py-2 rounded-lg transition-colors flex-1 flex items-center justify-center gap-2 shadow-md ${
                                guest?.participating
                                  ? "bg-event-purple text-white"
                                  : "bg-gray-100 text-gray-600"
                              } ${
                                loadingParticipationChange ||
                                guest.participating
                                  ? "cursor-not-allowed"
                                  : ""
                              } ${
                                loadingParticipationChange ? "opacity-50" : ""
                              }`}
                            >
                              {loadingParticipationChange &&
                                guest.participating && (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                              Tham gia
                            </button>

                            {/* Nút Vắng mặt */}
                            <button
                              onClick={() => handleParticipationChange(false)}
                              disabled={loadingParticipationChange} // Không bấm được khi loading
                              className={`px-2 py-2 rounded-lg transition-colors flex-1 flex items-center justify-center gap-2 shadow-md ${
                                !guest?.participating
                                  ? "bg-event-purple text-white"
                                  : "bg-gray-100 text-gray-600"
                              } ${
                                loadingParticipationChange ||
                                !guest.participating
                                  ? "cursor-not-allowed"
                                  : ""
                              } ${
                                loadingParticipationChange ? "opacity-50" : ""
                              }`}
                            >
                              {loadingParticipationChange &&
                                !guest.participating && (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                              Vắng mặt
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="container px-0 mx-0 animate-fadeIn delay-300 py-4 border-b-2 border-black/20 mb-8">
            <div className="">
              <div className="">
                <div className="flex items-center mb-4">
                  <Clock className="md:w-8 md:h-8 text-event-purple" />
                  <h2 className="md:text-xl text-base font-semibold text-event-purple ml-4">
                    Timeline Sự kiện
                  </h2>
                </div>
                <div className="space-y-4">
                  {EventDetails.timeline.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      {item.time && (
                        <span className="text-event-gray font-medium min-w-[120px]">
                          {item.time}
                        </span>
                      )}
                      <span className="text-event-purple">{item.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
