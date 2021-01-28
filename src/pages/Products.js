import React from 'react';

import HorizontalNav7 from '../components/navs/HorizontalNav7';
import Pricing1 from '../components/pricing/Pricing1';

export default function Products() {
  return (
    <React.Fragment>
      <HorizontalNav7 pageValue={1}
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

      <Pricing1 content={null} />
    </React.Fragment>
  );
}

