import React from 'react';

import HorizontalNav7 from '../components/horizontal-navs/HorizontalNav7';
import SignIn1 from '../components/sign-in/SignIn1';

export default function Signup() {
  return (
    <React.Fragment>
      <HorizontalNav7
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

      <SignIn1 content={null} />
    </React.Fragment>
  );
}

