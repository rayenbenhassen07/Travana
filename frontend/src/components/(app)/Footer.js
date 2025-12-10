"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTelegramPlane,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Accueil", href: "/" },
    { name: "Logement", href: "/logement" },
    { name: "Excursion", href: "/excursion" },
    { name: "Articles", href: "/blog" },
  ];

  const supportLinks = [
    { name: "Centre d'aide", href: "/help" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Conditions", href: "/terms" },
  ];

  const destinations = [
    { name: "Tunis", href: "/destination/tunis" },
    { name: "Djerba", href: "/destination/djerba" },
    { name: "Hammamet", href: "/destination/hammamet" },
    { name: "Sousse", href: "/destination/sousse" },
  ];

  return (
    <footer className="bg-gradient-to-br from-secondary-950 via-secondary-900 to-secondary-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo/fullLogo.png"
                alt="Naseam Logo"
                width={150}
                height={50}
                className="brightness-0 invert"
              />
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Votre partenaire de confiance pour découvrir la Tunisie et le
              monde. Réservez facilement vos hôtels, excursions et voyages.
            </p>

            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-[family-name:var(--font-poppins)] font-semibold mb-4 text-primary-400">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="mr-2 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-[family-name:var(--font-poppins)] font-semibold mb-4 text-primary-400">
              Support
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="mr-2 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-[family-name:var(--font-poppins)] font-semibold mb-4 text-primary-400">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+21694398054"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <FaTelegramPlane className="text-primary-400" size={14} />
                  </div>
                  <span>+216 94 398 054</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@naseam.com"
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <FaEnvelope className="text-primary-400" size={14} />
                  </div>
                  <span>contact@naseam.com</span>
                </a>
              </li>
              <li className="text-neutral-300 text-sm flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-primary-400" size={14} />
                </div>
                <span>Tunis, Tunisie</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Destinations Bar */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <h4 className="text-sm font-semibold text-neutral-400 mb-3">
            Destinations populaires
          </h4>
          <div className="flex flex-wrap gap-3">
            {destinations.map((dest) => (
              <Link
                key={dest.name}
                href={dest.href}
                className="px-4 py-2 bg-white/5 hover:bg-primary-500 rounded-lg text-sm text-neutral-300 hover:text-white transition-all"
              >
                {dest.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
          <p>&copy; {currentYear} Naseam. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary-400 transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary-400 transition-colors"
            >
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500"></div>
    </footer>
  );
};

export default Footer;
