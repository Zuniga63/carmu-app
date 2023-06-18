import Image from 'next/image';
import brandLogo from 'public/images/logo_62601199d793d.png';

export default function LoginHeader() {
  const brandUrl = process.env.NEXT_PUBLIC_BRAND_LOGO_URL || brandLogo;
  const altContent = process.env.NEXT_PUBLIC_APP_NAME || 'App logo';

  return (
    <header className="mb-4">
      <figure className="relative mx-auto block h-20 w-1/2">
        <Image
          src={brandUrl}
          alt={altContent}
          fill
          className="object-contain"
        />
      </figure>
    </header>
  );
}
