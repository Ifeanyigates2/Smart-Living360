import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page">
      <p className="eyebrow">Missing page</p>
      <h1 className="page-title">That page is not here.</h1>
      <p className="lead">The link may have expired, or the address may be wrong.</p>
      <div className="actions-row">
        <Link href="/" className="btn">
          Back home
        </Link>
      </div>
    </div>
  );
}
