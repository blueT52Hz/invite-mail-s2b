import { MapPin, User, Check, X, Clock, Menu, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const EventDetails = {
  title:
    "Thư mời Tham dự Sinh nhật\n Cộng đồng phát triển tài năng sinh viên S2B",
  date: "Thứ bảy, 15 tháng 3",
  time: "18:00-21:30",
  thumbnail:
    "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/430992387_6885449308243674_6867332553438680711_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeHgLYPOF_aJ1kUEGXy7HcqUHU1y1fvEWHQdTXLV-8RYdK-ioIjSsQHYVmhw9h4HqAUynweQC0GXp1rVmTt68dI-&_nc_ohc=71DjfH5jpnIQ7kNvgH9UHL8&_nc_oc=AdgDpkxiDPEcvKknOIfQ8onDKZIwNtlkdBczfkZOncPp6xXPrZOak9DArRIwxvZcB1A&_nc_zt=23&_nc_ht=scontent.fhan14-3.fna&_nc_gid=AZmUr5bG1IZHgAgbHRq_Uv1&oh=00_AYD8avdI__QusdKcAq03WrszU7nRBcyBkdV_zIM9LsktLQ&oe=67BE47C6",
  location: {
    name: "Học viện Công nghệ Bưu chính viễn thông",
    address: "96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội, Việt Nam",
    mapUrl: "https://www.google.com/maps?cid=11743612530132812167",
  },
  timeline: [
    { time: "18h-18h30", event: "Check in" },
    { time: "18h30", event: "Bắt đầu sự kiện" },
    { time: "", event: "1" },
    { time: "", event: "2" },
    { time: "", event: "3" },
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
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const clb = searchParams.get("club");
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
          fetch(`${getBaseUrlPRO}?email=${email}&club=${clb}`),
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
    <div className="bg-purple-400/30">
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white min757:max-w-[757px] mx-auto shadow-lg before:content-[''] before:absolute before:top-0 before:left-0 before:w-2 before:h-full before:bg-gradient-to-r before:from-gray-300 before:to-transparent after:content-[''] after:absolute after:top-0 after:right-0 after:w-2 after:h-full after:bg-gradient-to-l after:from-gray-300 after:to-transparent">
        {/* Hero Section with Thumbnail */}
        <section className="container mx-0 my-0 px-0 animate-fadeIn overflow-hidden">
          <div className="mb-8">
            <img
              src={EventDetails.thumbnail}
              alt="Event thumbnail"
              className="w-full rounded-lg mb-8 object-cover"
            />
            <h1 className="text-[1.75rem] md:text-4xl font-bold text-center text-event-purple mb-4 min757:px-0 px-4">
              {EventDetails.title}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-event-gray">
              <Clock className="w-5 h-5" />
              <span>
                {EventDetails.date} • {EventDetails.time}
              </span>
            </div>
          </div>
        </section>

        <div className="flex flex-col px-4 min757:px-10 gap-10">
          {/* Location Section */}
          <section className="container mx-0 px-0 py-0 animate-fadeIn delay-100">
            <div className="">
              <a
                href={EventDetails.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-slate-300 transition-all rounded-lg p"
              >
                <div className="flex items-start space-x-4">
                  <MapPin className="w-8 h-8 my-auto text-event-purple flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-event-purple text-xl">
                      {EventDetails.location.name}
                    </h3>
                    <p className="text-event-gray mt-1">
                      {EventDetails.location.address}
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* Guest List Section with RSVP */}
          <section className="container px-0 py-0 mx-0 animate-fadeIn delay-200">
            <div className="">
              <div className="rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-8 h-8 text-event-purple" />
                  <h2 className="text-xl font-semibold text-event-purple">
                    Thông tin Khách mời
                  </h2>
                </div>
                <div className="space-y-4 px-14">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {/* Avatar + Name */}
                      {loading ? (
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-event-lightPurple flex items-center justify-center">
                          <span className="text-event-purple font-semibold">
                            {guest.name[0]}
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
                              className={`px-2 py-2 rounded-lg transition-colors flex-1 flex items-center justify-center gap-2 ${
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
                              className={`px-2 py-2 rounded-lg transition-colors flex-1 flex items-center justify-center gap-2 ${
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
          <section className="container px-0 py-0 mx-0 animate-fadeIn delay-300">
            <div className="">
              <div className="">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-8 h-8 text-event-purple" />
                  <h2 className="text-xl font-semibold text-event-purple">
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
                        <span className="text-event-gray font-medium min-w-[100px]">
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
