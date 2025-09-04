import Link from 'next/link';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  href: string;
}

export default function PricingSection() {
  const tiers: PricingTier[] = [
    {
      name: 'Free',
      price: '₦0',
      period: 'forever',
      description: 'Perfect for small businesses getting started',
      features: [
        '5 resume analyses per month',
        'Basic AI scoring',
        'PDF & DOCX support',
        'Email support',
        'Basic analytics'
      ],
      cta: 'Get Started Free',
      href: '/auth'
    },
    {
      name: 'Pro',
      price: '₦15,000',
      period: 'per month',
      description: 'Ideal for growing companies and HR teams',
      features: [
        '100 resume analyses per month',
        'Advanced AI insights',
        'WhatsApp integration',
        'Priority support',
        'Advanced analytics',
        'Export capabilities',
        'Team collaboration'
      ],
      popular: true,
      cta: 'Start Pro Trial',
      href: '/subscription?plan=pro'
    },
    {
      name: 'Enterprise',
      price: '₦50,000',
      period: 'per month',
      description: 'For large organizations with high volume needs',
      features: [
        'Unlimited resume analyses',
        'Custom AI training',
        'API access',
        'Dedicated support',
        'Custom integrations',
        'Advanced security',
        'SLA guarantee',
        'Custom branding'
      ],
      cta: 'Contact Sales',
      href: '/contact'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your hiring needs. All plans include our core AI analysis features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                tier.popular 
                  ? 'border-indigo-200 ring-2 ring-indigo-500 scale-105' 
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600 ml-2">/{tier.period}</span>
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={tier.href}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    tier.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include secure data handling and Nigerian Naira pricing via Paystack
          </p>
          <p className="text-sm text-gray-500">
            Need a custom solution? <Link href="/contact" className="text-indigo-600 hover:text-indigo-700">Contact our sales team</Link>
          </p>
        </div>
      </div>
    </section>
  );
}