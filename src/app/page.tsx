import Hero from '@/components/Hero';
import Features from '@/components/Features';
import FileUploadForm from '@/components/FileUploadForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Try It Now
            </h2>
            <p className="text-lg text-gray-600">
              Upload a resume and job description to see our AI analysis in action
            </p>
          </div>
          <FileUploadForm />
        </div>
      </section>
      
      <Features />
    </>
  );
}