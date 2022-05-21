import { LinkProps, NavLink } from "remix";

export default function Link({ to, children, ...rest }: LinkProps) {
  const activeStyle = {
    borderBottomWidth: 3,
    borderBottomColor: "var(--color-accent)",
    backgroundSize: "100% 3px",
    backgroundPosition: "0 100%",
    backgroundRepeat: "no-repeat",
    backgroundImage:
      "linearGradient(transparent, transparent), linearGradient(var(--color-accent), var(--color-accent))",
    fontWeight: "bold",
  };

  return (
    <NavLink
      {...rest}
      to={to}
      style={({ isActive }) => (isActive ? activeStyle : {})}
      className="link-underline link-underline-black"
    >
      {children}
    </NavLink>
  );
}
