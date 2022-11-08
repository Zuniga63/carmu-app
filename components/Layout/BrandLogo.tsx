import React from 'react';
import Image from 'next/image';
import brandLogo from 'public/images/logo_62601199d793d.png';
import Link from 'next/link';

export default function BrandLogo() {
  return (
    <div className="flex-shrink-0">
      <Link href="/" passHref>
        <figure className="flex w-20 items-center md:w-24">
          <Image src={brandLogo} alt="Carmú Logo" />
        </figure>
      </Link>
    </div>
  );
}
