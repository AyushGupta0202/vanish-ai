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
    <section className="py-12 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-semibold tracking-[-0.015em] text-center mb-12 text-white/92">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center space-y-4 rounded-2xl border border-white/10 bg-white/6 backdrop-blur-xl p-6 ring-1 ring-white/6"
            >
              <div className="text-6xl mb-4 text-white/90">{step.icon}</div>
              <h3 className="text-2xl font-semibold text-white/92">{step.title}</h3>
              <p className="text-white/62">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

