
import { MapPin, User, Check, X, Clock } from "lucide-react";
import { useState } from "react";

const EventDetails = {
  title: "Sinh nhật Cộng đồng tài năng sinh viên S2B Lần thứ 12",
  date: "Thứ bảy, 15 tháng 3",
  time: "18:00-21:30",
  thumbnail: "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/430992387_6885449308243674_6867332553438680711_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeHgLYPOF_aJ1kUEGXy7HcqUHU1y1fvEWHQdTXLV-8RYdK-ioIjSsQHYVmhw9h4HqAUynweQC0GXp1rVmTt68dI-&_nc_ohc=71DjfH5jpnIQ7kNvgH9UHL8&_nc_oc=AdgDpkxiDPEcvKknOIfQ8onDKZIwNtlkdBczfkZOncPp6xXPrZOak9DArRIwxvZcB1A&_nc_zt=23&_nc_ht=scontent.fhan14-3.fna&_nc_gid=AZmUr5bG1IZHgAgbHRq_Uv1&oh=00_AYD8avdI__QusdKcAq03WrszU7nRBcyBkdV_zIM9LsktLQ&oe=67BE47C6",
  location: {
    name: "Học viện Công nghệ Bưu chính viễn thông",
    address: "96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội, Việt Nam",
    mapUrl: "https://maps.google.com/?q=Học+viện+Công+nghệ+Bưu+chính+viễn+thông",
  },
  timeline: [
    { time: "18h-18h30", event: "Check in" },
    { time: "18h30", event: "Bắt đầu sự kiện" },
    { time: "", event: "1" },
    { time: "", event: "2" },
    { time: "", event: "3" },
  ],
  guests: [
    {
      name: "B22DCKHT15 - Nguyễn Hoa Thanh Tùng",
      email: "ttungchamhoc2k4@gmail.com",
      isOrganizer: true,
      confirmed: true,
      participating: true,
    },
  ],
};

const Index = () => {
  const [isParticipating, setIsParticipating] = useState(true);

  const handleParticipationChange = (participating: boolean) => {
    setIsParticipating(participating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section with Thumbnail */}
      <section className="container px-4 pt-8 pb-8 mx-auto animate-fadeIn">
        <div className="max-w-2xl mx-auto mb-8">
          <img 
            src={EventDetails.thumbnail} 
            alt="Event thumbnail" 
            className="w-full rounded-lg shadow-lg mb-8 aspect-video object-cover"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-center text-event-purple mb-4">
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

      {/* Location Section */}
      <section className="container px-4 py-8 mx-auto animate-fadeIn delay-100">
        <div className="max-w-xl mx-auto">
          <a
            href={EventDetails.location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-event-purple flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-event-purple">
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
      <section className="container px-4 py-8 mx-auto animate-fadeIn delay-200">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-event-purple" />
            <h2 className="text-xl font-semibold text-event-purple">
              {EventDetails.guests.length} khách
            </h2>
          </div>
          <div className="space-y-4">
            {EventDetails.guests.map((guest, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-event-lightPurple flex items-center justify-center">
                    <span className="text-event-purple font-semibold">
                      {guest.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-event-purple">{guest.name}</h3>
                    <p className="text-sm text-event-gray">{guest.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-1">
                    {guest.confirmed ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-event-gray">
                      {guest.confirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleParticipationChange(true)}
                      className={`px-4 py-2 rounded-lg transition-colors flex-1 ${
                        isParticipating
                          ? "bg-event-purple text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Tham gia
                    </button>
                    <button
                      onClick={() => handleParticipationChange(false)}
                      className={`px-4 py-2 rounded-lg transition-colors flex-1 ${
                        !isParticipating
                          ? "bg-event-purple text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Vắng mặt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container px-4 py-8 mx-auto animate-fadeIn delay-300">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-event-purple">
            Timeline sự kiện
          </h2>
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
      </section>
    </div>
  );
};

export default Index;
