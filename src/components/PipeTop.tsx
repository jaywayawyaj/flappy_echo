import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {Images} from '../../assets/Images';

type Props = {
  body: {
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

export const PipeTop = (props: Props) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <Image
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
      }}
      resizeMode="stretch"
      source={Images.pipeTop}
    />
  );
};
