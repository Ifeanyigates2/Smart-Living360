import Image from "next/image";
import Link from "next/link";

export function Wordmark({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className={compact ? "wordmark compact" : "wordmark"}>
      <Image
        src="/images/logo.png"
        alt="Smart-Living360 Global"
        width={560}
        height={323}
        priority={!compact}
      />
    </Link>
  );
}
