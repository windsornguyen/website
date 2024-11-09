const Footer = () => {
  const links = [
    { name: '@windsornguyen', url: 'https://x.com/windsornguyen' },
    {
      name: 'google scholar',
      url: 'https://scholar.google.com/citations?user=R9DN_W4AAAAJ&hl=en&oi=sra',
    },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/windsornguyen' },
    { name: 'github', url: 'https://github.com/windsornguyen' },
  ];

  return (
    <footer className='mt-12 text-center'>
      <div className='flex justify-center space-x-4 tracking-tight'>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-400 hover:text-blue-500 transition-colors duration-200'
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
