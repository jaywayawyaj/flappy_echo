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
import {Constants} from './src/constants';
import {GameEngine} from 'react-native-game-engine';
import {Pill} from './src/components/Pill';
import Physics from './src/components/Physics';
import {Wall} from './src/components/Wall';

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
    let floor = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH,
      50,
      {isStatic: true},
    );
    let ceiling = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      25,
      Constants.MAX_WIDTH,
      50,
      {isStatic: true},
    );

    Matter.World.add(world, [pill, floor, ceiling]);

    return {
      physics: {engine: engine, world: world},
      pill: {body: pill, size: [50, 50], color: 'pink', renderer: Pill},
      floor: {
        body: floor,
        size: [Constants.MAX_WIDTH, 50],
        color: 'green',
        renderer: Wall,
      },
      ceiling: {
        body: ceiling,
        size: [Constants.MAX_WIDTH, 50],
        color: 'green',
        renderer: Wall,
      },
    };
  };

  let entities = setupWorld();

  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngine}
        style={styles.gameContainer}
        running={running}
        systems={[Physics]}
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
