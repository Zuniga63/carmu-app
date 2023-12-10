import React from 'react';
import Image from 'next/image';
import brandLogo from '@/../public/images/logo_62601199d793d.png';
import Link from 'next/link';

export default function BrandLogo() {
  return (
    <div className="flex-shrink-0">
      <Link href="/" passHref>
        <figure className="relative flex aspect-video w-20 items-center md:w-24">
          <Image
            src={process.env.NEXT_PUBLIC_BRAND_LOGO_URL || brandLogo}
            alt={process.env.NEXT_PUBLIC_APP_NAME || 'Carmú Logo'}
            fill
            className="object-contain"
          />
        </figure>
      </Link>
    </div>
  );
}
