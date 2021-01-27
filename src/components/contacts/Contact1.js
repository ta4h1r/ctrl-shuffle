import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function Contact(props) {
  const content = {
    'header': 'Contact the Pied Piper team',
    'description': 'We\'re here to answer your questions and discuss the decentralized future of the internet. Let\'s talk!',
    'terms': 'I agree to the terms of use and privacy policy.',
    'primary-action': 'Submit',
    ...props.content
  };

  return (
    <section>
      <Container maxWidth="sm">
        <Box pt={8} pb={10}>
          <Box mb={6} textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom={true}>{content['header']}</Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph={true}>{content['description']}</Typography>
          </Box>
          <Box>
            <form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField variant="outlined" required fullWidth autoComplete="fname" name="firstName" id="firstName" label="First name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField variant="outlined" required fullWidth name="lastName" id="lastName" label="Last name" autoComplete="lname" />
                </Grid>
                <Grid item xs={12}>
                  <TextField variant="outlined" required fullWidth name="email" id="email" label="Email address" autoComplete="email" />
                </Grid>
                <Grid item xs={12}>
                  <TextField variant="outlined" required multiline rows={5} fullWidth autoComplete="message" name="message" id="message" label="Message" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox name="terms" value="1" color="primary" />} label={content['terms']} />
                </Grid>
              </Grid>
              <Box my={2}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  {content['primary-action']}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </section>
  );
}