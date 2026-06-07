import ViewIcon from '@hugeicons/core-free-icons/ViewIcon';
import ViewOffIcon from '@hugeicons/core-free-icons/ViewOffIcon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import React, { useState } from 'react';
import Input from '@/components/ui/Input';

type InputProps = React.ComponentProps<typeof Input>;

type Props = Omit<InputProps, 'secureTextEntry' | 'rightIcon' | 'onRightIconPress'> & {
  icon?: React.ReactNode;
};

const PasswordInput = (props: Props) => {
  const [visible, setVisible] = useState(false);

  const toggleIcon = (
    <HugeiconsIcon icon={(visible ? ViewIcon : ViewOffIcon) as IconSvgElement} size={22} />
  );

  return (
    <Input
      {...props}
      secureTextEntry={!visible}
      rightIcon={toggleIcon}
      onRightIconPress={() => setVisible((v) => !v)}
    />
  );
};

export default PasswordInput;
