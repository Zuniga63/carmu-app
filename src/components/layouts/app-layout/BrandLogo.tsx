import React from 'react';
import Image from 'next/image';
import brandLogo from '@/../public/images/logo_62601199d793d.png';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = '' }: BrandLogoProps) {
  const logoUrl = process.env.NEXT_PUBLIC_BRAND_LOGO_URL || brandLogo;
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Pola Beaufor';

  return (
    <Link href="/" className={`flex-shrink-0 ${className}`}>
      <figure className="relative flex aspect-video w-20 items-center md:w-24">
        <Image
          src={logoUrl}
          alt={appName}
          fill
          className="object-contain"
          sizes="(min-width: 768px) 96px, 80px"
          priority
          quality={90}
        />
      </figure>
    </Link>
  );
}
