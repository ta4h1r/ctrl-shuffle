import React from 'react';

import HorizontalNav7 from '../components/navs/HorizontalNav7';
import Footer from '../components/footers/Footer';
import Landing from './Landing';
import PageNotFound from './PageNotFound';

export default function Index() {
  return (
    <React.Fragment>
      <HorizontalNav7 pageValue={0}
        content={{
          brand: {
            text: 'CTRL Robotics',
            // image: './images/ctrl.svg',
            width: '56',
          },
          'brand-small': {
            text: 'CTRL Robotics',
            // image: './images/ctrl.svg',
            width: '32',
          },
          link1: 'About Us',
          link2: 'Products',
          link3: 'Contact',
          link4: 'Login',
        }}
      />
      {/* <Landing /> */}

      <PageNotFound/>

      <Footer />

    </React.Fragment>
  );
}

