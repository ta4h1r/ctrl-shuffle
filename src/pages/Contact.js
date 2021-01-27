import React from 'react';

import HorizontalNav7 from '../components/horizontal-navs/HorizontalNav7';
import Contact1 from '../components/contacts/Contact1';

export default function Contact() {
  return (
    <React.Fragment>
      <HorizontalNav7 pageValue={2}
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

      <Contact1
        content={{
          header: 'Contact the CTRL Robotics team',
          description:
            "We're here to answer your questions and discuss the future of robotics. Let's talk!",
        }}
      />
    </React.Fragment>
  );
}

