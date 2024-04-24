import { Metadata } from 'next'
import Nav from './components/nav';
import 'bootstrap/dist/css/bootstrap.css';
import ContextProviders from './lib/context/providers';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'xlegoleg' }],
  creator: 'xlegoleg',
  publisher: 'xlegoleg',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="en">
      <body>
        <ContextProviders>
          <>
            <Nav/>
            <main>{children}</main>
          </>
        </ContextProviders>
      </body>
    </html>
  )
};

export default RootLayout;