import { Link } from "remix";

interface Props {
  links: Array<{ slug: string; name: string }>;
}

export default function Breadcrumbs({ links }: Props) {
  return (
    <div className="flex items-center space-x-2 text-sm font-bold">
      {links.map((link, index) => (
        <>
          <Link key={link.slug} to={link.slug}>
            {link.name}
          </Link>
          {index !== links.length - 1 && <span className="mx-4">{"/"}</span>}
        </>
      ))}
    </div>
  );
}
