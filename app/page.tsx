import Project from './projects';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <nav className="z-10 w-full max-w-5xl flex items-center justify-between font-mono text-sm mb-10">
        <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
        <a href="#blog" className="hover:text-green-500 transition-colors">Blog</a>
        <a href="#projects" className="hover:text-yellow-500 transition-colors">Projects</a>
        <a href="#contact" className="hover:text-red-500 transition-colors">Contact</a>
      </nav>

      <div className="relative flex place-items-center justify-center h-screen lg:h-auto lg:py-20">
        <span className="text-6xl lg:text-9xl tracking-widest border-r-4 border-black w-full blinking-cursor inline-block">
          Windsor Nguyễn.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
        {/* Insert your links here */}
      </div>

      {/* New Portfolio Section */}
      <section className="w-full max-w-5xl mt-24">
        <h2 className="text-4xl font-bold mb-8">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Project title="Project 1" description="Description of Project 1." delay={0.2} position={1} />
          <Project title="Project 2" description="Description of Project 2." delay={0.4} position={2} />
          <Project title="Project 3" description="Description of Project 3." delay={0.6} position={3} />
          <Project title="Project 4" description="Description of Project 4." delay={0.8} position={4} />
        </div>
      </section>

      <footer className="flex justify-center items-center mt-12 text-gray-500">
        Made with ❤️ by Windsor Nguyễn © 2023.
      </footer>
    </main>
  )
}
