"use client";

export default function CallButton() {
  const phoneNumber = "+17624754312";
  
  return (
    <>
      <style>
        {`
          @keyframes pulse-ring {
            0% {
              box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(234, 88, 12, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(234, 88, 12, 0);
            }
          }
          .pulse-ring {
            animation: pulse-ring 2s infinite;
          }
        `}
      </style>
      <div className="fixed bottom-6 bg-green-500 rounded-lg right-6 z-50">
        <a
          href={`tel:${phoneNumber}`}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-african-orange to-african-terracotta hover:from-african-terracotta hover:to-african-red text-white rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group pulse-ring"
          aria-label="Call our 24hr agent"
          title="Call our 24hr agent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5 group-hover:animate-pulse"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
          <span className="font-semibold text-sm text-black">Call our 24hr agent</span>
        </a>
      </div>
    </>
  );
}
