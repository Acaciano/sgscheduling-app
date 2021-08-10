import React, { useMemo } from 'react';
import { Container, ContainerNoImage, ContainerNoImageText, ProfileButton } from './styles';


const Avatar = React.FC = ({ url_avatar: url_avatar, name: name, ...rest }) => {

  const initials = useMemo(() => {

    if (name) {
      var splitName = name.split(' ');

      let value = (splitName[0].substring(0, 1));

      if (splitName.length > 0) {
        value += splitName[splitName.length - 1].substring(0, 1);
      }

      return value;
    }
    return '';
  }, []);

  return (
    <>
      { (url_avatar && url_avatar != null) && (
        <Container source={{ uri: url_avatar }} />
      )}

      { (url_avatar == null || url_avatar.length <= 0) && (
        <ContainerNoImage>
          <ContainerNoImageText>{initials}</ContainerNoImageText>
        </ContainerNoImage>
      )}
    </>
  )
};

export default Avatar;
