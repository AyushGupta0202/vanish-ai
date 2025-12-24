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
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Why Vanish</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-graphite border-graphite">
              <CardHeader>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

