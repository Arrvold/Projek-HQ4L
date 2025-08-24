'use client'

import { Github, Twitter, Linkedin, Mail, Gamepad2, Users, Trophy, Shield } from 'lucide-react'

const footerLinks = {
  game: ['Characters', 'Quests', 'Guilds', 'Leaderboard', 'Achievements'],
  community: ['Forum', 'Discord', 'Events', 'Tournaments', 'Fan Art'],
  support: ['Help Center', 'Contact', 'Bug Report', 'FAQ', 'Tutorials'],
  legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Licenses', 'DMCA']
}

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' }
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                <Gamepad2 className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold font-minecraft">GameWorld RPG</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md font-minecraft">
              Dunia fantasi terbaik untuk petualangan RPG-mu. 
              Bergabunglah dengan ribuan pemain dari seluruh dunia 
              dalam petualangan epik yang tak terlupakan.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 capitalize text-yellow-400 font-minecraft">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-yellow-400 transition-colors font-minecraft"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-minecraft">
            © 2024 GameWorld RPG. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0 font-minecraft">
            Made with ❤️ for RPG enthusiasts
          </p>
        </div>
      </div>
    </footer>
  )
}
