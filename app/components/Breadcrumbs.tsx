import { Link } from "@remix-run/react";
import React from 'react';

interface Props {
  links: Array<{ slug: string; name: string }>;
}

export default function Breadcrumbs({ links }: Props) {
  return (
    <div className="flex items-center space-x-2 text-sm font-bold">
      {links.map((link, index) => (
        <React.Fragment key={link.slug}>
          <Link to={link.slug}>
            {link.name}
          </Link>
          {index !== links.length - 1 && <span className="mx-4">{"/"}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
