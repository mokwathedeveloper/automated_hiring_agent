import Link from 'next/link';

export default function CTA() {
  return (
    <section className="bg-indigo-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Hiring Process?
        </h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join Nigerian companies already using AI to find the best candidates faster and more efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth" className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors">
            Start Free Trial
          </Link>
          <Link href="/pricing" className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold py-3 px-8 rounded-lg transition-colors">
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}