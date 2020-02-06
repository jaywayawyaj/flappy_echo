/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {Fragment, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Matter from 'matter-js';
import {Constants} from './src/components/constants';
import {GameEngine} from 'react-native-game-engine';

const App = () => {
  const [running, setRunning] = useState(true);
  let gameEngine = useRef(null);

  const setupWorld = () => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;

    let pill = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 4,
      Constants.MAX_HEIGHT / 2,
      50,
      50,
    );

    Matter.World.add(world, [pill]);

    return {
      physics: {engine: engine, world: world},
      pill: {body: pill, size: [50, 50], color: 'red', renderer: Pill},
    };
  };

  let entities = setupWorld();

  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngine}
        style={styles.gameContainer}
        running={running}
        entities={entities}>
        <StatusBar hidden={true} />
      </GameEngine>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default App;
