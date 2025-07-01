
import { Video,Shield,Users,Zap,Play,Star } from 'lucide-react';

const Homepage= ()=>{
    return(
 <div className="min-h-screen bg-stone-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-red-50 to-stone-200">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(0,0,0,0.1) 90deg, transparent 180deg)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-8 p-4 bg-black text-white transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase">
                CALL<br/>DIRECT
              </h1>
            </div>
            
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-2xl sm:text-3xl font-bold text-stone-800 mb-4 leading-tight">
                RAW. SIMPLE. DIRECT.
              </p>
              <p className="text-lg text-stone-600 font-medium px-8 py-4 bg-white/60 border-4 border-black transform rotate-1">
                No accounts. No tracking. Just pure peer-to-peer video calls that work.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="/lobby">
              <button 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white font-black text-xl px-12 py-6 border-4 border-black transform hover:scale-105 transition-all duration-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Play className="mr-3 h-6 w-6" />
                START CALLING
              </button>
              </a>
              <div className="text-sm text-stone-600 bg-amber-100 px-6 py-3 border-2 border-stone-400 font-mono">
                ★ NO SIGNUP REQUIRED ★
              </div>
            </div>
          </div>
        </div>

        {/* Pixel art decorative elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 transform rotate-45" style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 60%, 75% 100%, 0 100%)'
        }}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500" style={{
          clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'
        }}></div>
        <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 transform rotate-45" style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)'
        }}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500" style={{
          clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'
        }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-t-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-6 transform -rotate-1">
              WHY WE'RE DIFFERENT
            </h2>
            <div className="w-32 h-2 bg-red-500 mx-auto transform rotate-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Video,
                title: "DIRECT P2P",
                description: "Your calls go straight between devices. No servers. No middlemen.",
                color: "bg-blue-500"
              },
              {
                icon: Shield,
                title: "ZERO TRACKING",
                description: "We don't store anything. We don't track anything. Period.",
                color: "bg-green-500"
              },
              {
                icon: Users,
                title: "INSTANT ROOMS",
                description: "Share a link. Start talking. It's that brutally simple.",
                color: "bg-purple-500"
              },
              {
                icon: Zap,
                title: "LIGHTNING FAST",
                description: "No bloat. No features you don't need. Just pure speed.",
                color: "bg-orange-500"
              }
            ].map((feature, index) => (
              <card key={index} className="p-8 border-4 border-black transform hover:scale-105 transition-transform duration-200 bg-stone-50 hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className={`${feature.color} w-16 h-16 mx-auto mb-6 flex items-center justify-center border-4 border-black`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-black mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-stone-600 font-medium text-center leading-relaxed">
                  {feature.description}
                </p>
              </card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50 border-t-8 border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-6">
              3 STEPS. DONE.
            </h2>
          </div>

          <div className="space-y-12">
            {[
              {
                number: "01",
                title: "CLICK START",
                description: "Hit the big red button. No forms. No passwords. No BS."
              },
              {
                number: "02", 
                title: "SHARE LINK",
                description: "Copy the room link. Send it however you want. Text, email, carrier pigeon."
              },
              {
                number: "03",
                title: "TALK DIRECTLY",
                description: "They click. You're connected. Peer-to-peer. Raw and real."
              }
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-8 group">
                <div className="bg-black text-white text-4xl font-black w-20 h-20 flex items-center justify-center border-4 border-black group-hover:bg-red-500 transition-colors duration-200">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-black mb-2">{step.title}</h3>
                  <p className="text-xl text-stone-600 font-medium">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-6xl font-black mb-6 transform -rotate-1">
              READY TO CALL?
            </h2>
            <p className="text-2xl font-bold text-stone-300 mb-8">
              No setup. No signup. No surrender of your data.
            </p>
          </div>
<a href="/lobby">
          <button 
            size="lg" 
            className="bg-red-500 hover:bg-red-600 text-white font-black text-2xl px-16 py-8 border-4 border-white transform hover:scale-105 transition-all duration-200 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            <Video className="mr-4 h-8 w-8" />
            START YOUR FIRST CALL
          </button>
</a>
          <div className="mt-12 flex justify-center space-x-8 text-stone-400">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span className="font-mono">100% FREE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="font-mono">ZERO TRACKING</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span className="font-mono">INSTANT SETUP</span>
            </div>
          </div>
        </div>

        {/* Pixel decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
      </section>
    </div>
 )
}

export default Homepage;