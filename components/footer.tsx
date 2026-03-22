// Copyright (c) 2026 Windsor Nguyen. MIT License.

const Footer = () => {
  const links = [
    { name: "@windsornguyen", url: "https://x.com/windsornguyen" },
    {
      name: "Google Scholar",
      url: "https://scholar.google.com/citations?user=R9DN_W4AAAAJ&hl=en&oi=sra",
    },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/windsornguyen" },
    { name: "GitHub", url: "https://github.com/windsornguyen" },
  ];

  return (
    <footer className="mt-12 text-center">
      <div className="flex justify-center space-x-4 tracking-tight">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted transition-colors duration-200 hover:text-fg-secondary"
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
