import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WhyVanish() {
  const features = [
    {
      title: 'Zero Artifacts',
      description: 'Clean removal with no visible traces',
    },
    {
      title: 'No Manual Cleanup',
      description: 'AI handles everything automatically',
    },
    {
      title: 'Realistic Fill',
      description: 'Intelligent background reconstruction',
    },
  ]

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-semibold tracking-[-0.015em] text-center mb-12 text-white/92">
          Why Vanish
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="">
              <CardHeader>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/62">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

