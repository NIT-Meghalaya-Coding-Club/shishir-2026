export default function Navigation() {
    const navItems = [
      'EVENTS',
      'COMPETITIONS',
      'SCHEDULE',
      'SPONSORS',
      'CONTACT US'
    ]
  
    return (
      <nav className="fixed z-50 w-full px-4 py-6">
        <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
          {navItems.map((item) => (
            <li key={item}>
              <button className="relative px-8 py-3 text-sm font-bold transition-transform hover:scale-105">
                <div className="absolute inset-0 bg-[#ffc278] transform skew-x-[-12deg] rounded-md" />
                <span className="relative text-[#2b1b4d]">{item}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
  