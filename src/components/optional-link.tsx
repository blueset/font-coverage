export function OptionalLink({ href, children, ...rest }:  React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return <span {...rest}>{children}</span>;
}