import React from 'react'

import Features from '../components/features/Features4';
import Header4 from '../components/headers/Header4';
import Portfolio2 from '../components/portfolio/Portfolio2';
import Team1 from '../components/team/Team1';

import ReactGA from 'react-ga';
const trackingId = "G-ZZM5TZYS1H";

function Landing() {
  ReactGA.initialize(trackingId);
  ReactGA.pageview(window.location.pathname + window.location.search);
  return (
    <div>
      <Header4
        content={{
          header: 'Robotics Made Easy',
          description:
            "CTRL Robotics is on it's way to revolutionizing robotics.",
          'primary-action': 'Sign up',
          video: 'https://www.youtube.com/embed/suZLmWCqV6g',
        }}
      />

      <Features
        content={{

        }}
      />

      {/* <Portfolio2
        content={{
          '02_header': 'Great companies we work with',
          '02_description':
            'We are constantly looking for new partners to migrate onto the CTRL Robotics platform. The future of the robotics is here!',
          'primary-action': 'View all partners',
        }}
      /> */}

      <Team1
        content={{
          header: 'Team',
          description:
            "We're a nimble start up building technology for the upcoming automation revolution.",
          '01_image': './images/steve.jpg',
          '01_name': 'Steven Pinto',
          '01_description':
            "When I'm not obsessively stressing about the fate of CTRL Robotics, I sometimes give lectures to school kids.",
          '02_image': './images/nik.jpg',
          '02_name': 'Nikhil Ranchod',
          '02_description':
            'I am the absolute best programmer at CTRL Robotics.',
          '03_image': './images/2-cropped.jpg',
          '03_name': 'Taahir Bhaiyat',
          '03_description':
            'I work on CTRL Robotics only for the advanced technology. The Team need me to put out their fires, so I stay.',
        }}
      />
    </div>
  )
}

export default Landing
