import React from 'react';

import { Container, ButtonText } from './styles';

const Button = React.FC = ({ children, ...rest }) => (
  <Container {...rest}>
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
