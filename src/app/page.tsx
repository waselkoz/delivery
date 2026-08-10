import DeliveryRequestForm from "./DeliveryRequestForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans relative">
      <section className="py-20 md:py-32 bg-gray-50 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12" dir="rtl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
              توصيل سريع وموثوق
            </h2>
            <p className="text-lg text-gray-600">
              املأ النموذج أدناه وسنقوم بتوصيل طلبك في أسرع وقت.
            </p>
          </div>
          <div className="animate-fade-in-up">
            <DeliveryRequestForm />
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-gray-100" dir="rtl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
