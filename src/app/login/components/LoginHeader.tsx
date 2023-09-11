import brandLogo from 'public/images/logo_62601199d793d.png';
import Image from 'next/image';

export default function LoginHeader() {
  return (
    <header className="mb-8 xl:mb-16">
      <figure className="mx-auto mb-2 flex justify-center lg:w-8/12">
        <Image src={brandLogo} alt={process.env.NEXT_PUBLIC_APP_NAME || 'App Name'} />
      </figure>
      <p className="text-center text-lg text-dark text-opacity-60">{process.env.NEXT_PUBLIC_APP_DESCRIPTION}</p>
    </header>
  );
}