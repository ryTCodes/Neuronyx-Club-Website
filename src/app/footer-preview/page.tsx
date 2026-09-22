import Footer from "@/components/Footer";

export default function FooterPreviewPage() {
  return (
    <main className="min-h-screen bg-[#05070D]">
      <div className="flex min-h-screen items-center justify-center px-5 text-center text-white">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#64748B]">
            NeurOnyx
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Footer Preview
          </h1>

          <p className="mt-2 text-sm text-[#64748B]">
            Scroll down to preview the footer.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}