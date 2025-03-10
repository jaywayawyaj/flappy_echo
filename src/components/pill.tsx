import React from 'react';
import {View, Image, Animated} from 'react-native';
import {Images} from '../../assets/Images';

type Props = {
  body: {
    velocity: {
      y: number;
    };
    position: {
      x: number;
      y: number;
    };
    bounds: {
      min: {
        x: number;
        y: number;
      };
      max: {
        x: number;
        y: number;
      };
    };
  };
  pose: number;
};

export const Pill = (props: Props) => {
  const animatedValue = new Animated.Value(props.body.velocity.y);
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  let image = Images['pill' + props.pose];

  animatedValue.setValue(props.body.velocity.y);
  let rotation = animatedValue.interpolate({
    inputRange: [-10, 0, 10, 20],
    outputRange: ['-10deg', '0deg', '15deg', '45deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.Image
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        transform: [{rotate: rotation}],
      }}
      resizeMode="stretch"
      source={image}
    />
  );
};
