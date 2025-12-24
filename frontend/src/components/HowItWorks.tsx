export default function HowItWorks() {
  const steps = [
    {
      icon: '☐',
      title: 'Select',
      description: 'Draw on areas to remove',
    },
    {
      icon: '✂',
      title: 'Vanish',
      description: 'AI removes instantly',
    },
    {
      icon: '⬇',
      title: 'Download',
      description: 'Get your clean image',
    },
  ]

  return (
    <section className="py-20 px-4 bg-graphite">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="text-6xl mb-4">{step.icon}</div>
              <h3 className="text-2xl font-semibold text-white">{step.title}</h3>
              <p className="text-muted-gray">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

