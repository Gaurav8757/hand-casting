import { MapPin, Sparkles, Truck } from 'lucide-react'

function OurServices() {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
             <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Services
          </h2>
          <p className="text-lg text-foreground/70">
            Our Best Handcrafted Personalized Gifts Services Promise
          </p>
        </div>

    
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass p-6 flex items-start gap-4 shadow-2xl">
              <div className="p-3 bg-accent/20 rounded-lg shrink-0">
                <Sparkles className="text-accent" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Handcrafted with Care
                </h4>
                <p className="text-sm text-foreground/70">
                  Every piece is meticulously finished by Sujay Jaguliya to ensure museum-grade quality.
                </p>
              </div>
            </div>

            <div className="glass p-6 flex items-start gap-4 shadow-2xl">
              <div className="p-3 bg-accent/20 rounded-lg shrink-0">
                <Truck className="text-accent" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Secure Shipping
                </h4>
                <p className="text-sm text-foreground/70">
                  We ship our Resin and String Art across India in multi-layered, shockproof packaging.
                </p>
              </div>
            </div>

            <div className="glass p-6 flex items-start gap-4 shadow-2xl">
              <div className="p-3 bg-accent/20 rounded-lg shrink-0">
                <MapPin className="text-accent" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Kolkata Studio & Home Sessions
                </h4>
                <p className="text-sm text-foreground/70">
                  Visit our studio or book a premium home-casting session for your convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurServices