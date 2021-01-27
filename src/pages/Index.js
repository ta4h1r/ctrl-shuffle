import React from 'react';

import HorizontalNav7 from '../components/horizontal-navs/HorizontalNav7';
import Footer from '../components/footers/Footer';
import Landing from './Landing';

export default function Index() {
  return (
    <React.Fragment>
      <HorizontalNav7 pageValue={0}
        content={{
          brand: {
            text: 'CTRL Robotics',
            image: '',
            width: '80',
          },
          'brand-small': {
            text: 'CTRL Robotics',
            image: '',
            width: '32',
          },
          link1: 'About Us',
          link2: 'Products',
          link3: 'Contact',
          link4: 'Login',
        }}
      />

      <Landing/>

      <Footer/>
    </React.Fragment>
  );
}

