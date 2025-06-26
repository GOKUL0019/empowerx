import { useEffect, useState } from "react";

const Team = () => {
  const [activeMember, setActiveMember] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "Mr. Noorul",
      role: "Founder & CAO",
      bio: "Waited so hard for a revolution in the system, that we chose to change it ourselves",
      image: "🧑‍🎓",
      color: "#0ea5e9"
    },
    {
      name: "Nowfal",
      role: "COO",
      bio: "Expert in immersive educational experiences and visual learning",
      image: "🧑‍💼",
      color: "#8b5cf6"
    },
    {
      name: "Darshan",
      role: "CSO",
      bio: "Let’s Seed with curiosity, Water with practice, Manure with evaluation, Remove the weeds of fear and harvest the magic of math",
      image: "🧑‍🔬",
      color: "#ec4899"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMember(prev => (prev + 1) % teamMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Central glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[80vh] h-[80vh] rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="block">Meet Our</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mt-2">
              Expert Team
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Passionate educators and technologists dedicated to revolutionizing math education
          </p>

          <div className="inline-flex space-x-2 mt-6">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveMember(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeMember === index ? 'bg-yellow-400 scale-125' : 'bg-gray-600'}`}
                aria-label={`View team member ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Spotlight animation */}
        <div className="relative h-96 mb-20">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-1000 ${activeMember === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <div
                className="text-9xl mb-6 transition-transform duration-700"
                style={{
                  transform: activeMember === index ? 'translateY(0) rotate(0deg)' : 'translateY(50px) rotate(10deg)',
                  textShadow: `0 0 20px ${member.color}, 0 0 40px ${member.color}`
                }}
              >
                {member.image}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{member.name}</h2>
              <p className="text-xl text-yellow-400 mb-4">{member.role}</p>
              <p className="text-gray-300 max-w-md text-center">{member.bio}</p>
            </div>
          ))}
        </div>

        {/* Team cards */}
        <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveMember(index)}
              className={`relative bg-gray-900/80 backdrop-blur-md rounded-xl p-6 border transition-all duration-500 overflow-hidden cursor-pointer
                ${hoveredCard === index ? 'border-yellow-400 scale-105' : 'border-gray-800 scale-100'}
                ${activeMember === index ? 'ring-2 ring-yellow-400' : ''}`}
              style={{
                transform: hoveredCard === index ? 'translateY(-10px)' : 'translateY(0)',
                boxShadow: hoveredCard === index ? `0 10px 30px -10px ${member.color}80` : '0 4px 20px -5px rgba(0,0,0,0.5)'
              }}
            >
              <div
                className="absolute inset-0 opacity-20 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(600px at 50% 50%, ${member.color}40, transparent)`,
                  opacity: hoveredCard === index ? 0.4 : 0
                }}
              ></div>

              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full transition-opacity duration-500"
                style={{
                  background: `radial-gradient(100px, ${member.color}40, transparent)`,
                  opacity: hoveredCard === index ? 1 : 0
                }}
              ></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div
                  className="text-6xl mb-4 transition-transform duration-500"
                  style={{
                    transform: hoveredCard === index ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0)',
                    textShadow: hoveredCard === index ? `0 0 15px ${member.color}` : 'none'
                  }}
                >
                  {member.image}
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p
                  className="font-medium mb-4 transition-all duration-300"
                  style={{ color: hoveredCard === index ? member.color : '#f59e0b' }}
                >
                  {member.role}
                </p>
                <p className="text-gray-300 text-sm">{member.bio}</p>

                <div
                  className="w-24 h-0.5 mt-4 transition-all duration-500"
                  style={{
                    background: `linear-gradient(to right, transparent, ${member.color}, transparent)`,
                    opacity: hoveredCard === index ? 1 : 0.5,
                    transform: hoveredCard === index ? 'scaleX(1.2)' : 'scaleX(1)'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        </div>
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Vision for Math Education</h2>
          <p className="text-gray-300 mb-8">
            We believe mathematics should be an immersive, intuitive experience. By combining
            cutting-edge 3D visualization technology with pedagogical expertise, we're creating
            learning tools that make abstract concepts tangible and engaging for students of all ages.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 rounded-full text-sm font-medium">
              Immersive Learning
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-700 px-6 py-3 rounded-full text-sm font-medium">
              Visual Understanding
            </div>
            <div className="bg-gradient-to-r from-rose-600 to-pink-700 px-6 py-3 rounded-full text-sm font-medium">
              Interactive Exploration
            </div>
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 rounded-full text-sm font-medium">
              Intuitive Interfaces
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
