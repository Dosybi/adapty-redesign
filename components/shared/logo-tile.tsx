import Image from "next/image";

interface LogoTileProps {
  logoSrc: string;
  alt: string;
}

export function LogoTile({ logoSrc, alt }: LogoTileProps) {
  return (
    <div className="group flex h-12 items-center justify-center rounded-xl border border-border/40 bg-background px-3 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:cursor-pointer hover:border-border/60 hover:shadow-sm sm:h-14">
      {/* fixed logo slot */}
      <div className="relative h-6 w-[120px] sm:h-7 sm:w-[132px]">
        <Image
          src={logoSrc}
          alt={alt}
          fill
          sizes="132px"
          className="object-contain opacity-80 transition-opacity group-hover:opacity-100"
          loading="lazy"
        />
      </div>
    </div>
  );
}
