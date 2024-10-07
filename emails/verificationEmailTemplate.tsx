import React from 'react';
import {Html, Container, Section, Heading, Text, Button, Hr } from '@react-email/components'

interface EmailTemplateProps {
  username: string;
  verifyCode: string;
}

export const VerifyEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  verifyCode,
}) => (
  <Html>
    <Container style={containerStyles}>
      <Section style={sectionStyles}>
        <Heading style={headingStyles}>Verify Your Email, {username}!</Heading>
        <Text style={textStyles}>
          Thank you for signing up with Deepak! Please verify your email by entering the following code:
        </Text>
        <Text style={codeStyles}>{verifyCode}</Text>
        <Text style={textStyles}>
          This code will expire in 30 minutes. If you didn’t sign up for this account, you can safely ignore this email.
        </Text>
        <Hr style={dividerStyles} />
        <Button href="mailto:deepak.solanki2335@gmail.com" style={buttonStyles}>
          Contact Support
        </Button>
        <Text style={footerStyles}>
          Best regards,<br />The Deepak Team
        </Text>
      </Section>
    </Container>
  </Html>
);

const containerStyles = {
  backgroundColor: '#f4f4f4',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  maxWidth: '600px',
  margin: '0 auto',
};

const sectionStyles = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headingStyles = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold' as const,
  marginBottom: '20px',
};

const textStyles = {
  fontSize: '16px',
  color: '#555',
  lineHeight: '1.5',
};

const codeStyles = {
  fontSize: '22px',
  color: '#27ae60',
  fontWeight: 'bold' as const,
  textAlign: 'center' as const,
  margin: '20px 0',
};

const buttonStyles = {
  backgroundColor: '#27ae60',
  color: '#ffffff',
  textDecoration: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  display: 'inline-block',
  fontSize: '16px',
};

const dividerStyles = {
  border: 'none',
  borderTop: '1px solid #ddd',
  margin: '20px 0',
};

const footerStyles = {
  fontSize: '14px',
  color: '#777',
  marginTop: '20px',
};

export default VerifyEmailTemplate