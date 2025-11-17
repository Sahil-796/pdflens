import React from 'react';
import { Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function FooterSection() {
  const productLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Generate', href: '/generate' },
    { name: 'Edit', href: '/edit' }
  ];

  const toolLinks = [
    { name: 'PDF to Word', href: '/tools/pdf-to-word' },
    { name: 'Word to PDF', href: '/tools/word-to-pdf' },
    { name: 'PDF to Markdown', href: '/tools/pdf-to-md' },
    { name: 'PPT to PDF', href: '/tools/ppt-to-pdf' },
    { name: 'Merge PDF', href: '/tools/merge-pdf' },
    { name: 'Split PDF', href: '/tools/split-pdf' }
  ];

  const socialLinks = [
    {
      name: 'Rudra',
      links: [
        { icon: Github, href: 'https://github.com/vyeos', label: 'GitHub' },
        { icon: Twitter, href: 'https://x.com/RudraPatel5435', label: 'X' }
      ]
    },
    {
      name: 'Sahil',
      links: [
        { icon: Github, href: 'https://github.com/Sahil-796', label: 'GitHub' },
        { icon: Twitter, href: 'https://x.com/SahilPa82684047', label: 'X' }
      ]
    }
  ];

  return (
    <footer className="w-full mt-24 border-t bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <h3 className="font-semibold text-lg text-primary mb-4">Product</h3>
            <div className="space-y-3">
              {productLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm flex"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-primary mb-4">Tools</h3>
            <div className="space-y-3">
              {toolLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm flex items-center gap-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-primary mb-4">Connect With Us</h3>
            <div className="space-y-4">
              {socialLinks.map((person) => (
                <div key={person.name}>
                  <p className="text-sm font-medium mb-2">{person.name}</p>
                  <div className="flex gap-3">
                    {person.links.map((social) => {
                      return (
                        <Link
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-all duration-200 hover:scale-110"
                          aria-label={`${person.name}'s ${social.label}`}
                        >
                          <social.icon className="w-4 h-4" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Zendra. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground text-center sm:text-right">
              Made with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
              <span className="font-semibold text-foreground">Sahil</span> and{' '}
              <span className="font-semibold text-foreground">Rudra</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
