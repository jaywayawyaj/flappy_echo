import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';

import Matter from 'matter-js';
import {Constants} from './src/constants';
import {GameEngine} from 'react-native-game-engine';
import {Pill} from './src/components/Pill';
import Physics from './src/components/Physics';
import {Wall} from './src/components/Wall';
import {Floor} from './src/components/Floor';
import {Images} from './assets/Images';

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generatePipes = () => {
  let topPipeHeight = randomBetween(100, Constants.MAX_HEIGHT / 2 - 100);
  let bottomPipeHeight =
    Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE;

  let sizes = [topPipeHeight, bottomPipeHeight];

  if (Math.random() < 0.5) {
    sizes = sizes.reverse();
  }

  return sizes;
};

const App = () => {
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  let gameEngine = useRef<any | null>(null);

  const setupWorld = () => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;
    world.gravity.y = 0.0;

    let pill = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT / 2,
      Constants.PILL_WIDTH,
      Constants.PILL_HEIGHT,
    );

    let floor1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      {isStatic: true},
    );

    let floor2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH + Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      {isStatic: true},
    );

    Matter.World.add(world, [pill, floor1]);

    Matter.Events.on(engine, 'collisionStart', event => {
      gameEngine.current.dispatch({type: 'game-over'});
    });

    return {
      physics: {engine: engine, world: world},
      pill: {body: pill, pose: 1, renderer: Pill},
      floor1: {body: floor1, renderer: Floor},
      floor2: {body: floor2, renderer: Floor},
    };
  };

  let entities = setupWorld();

  const onEvent = e => {
    if (e.type === 'game-over') {
      setRunning(false);
    } else if (e.type === 'score') {
      setScore(score + 1);
    }
  };

  const reset = () => {
    gameEngine.current.swap(setupWorld());
    setRunning(true);
    setScore(0);
  };

  return (
    <View style={styles.container}>
      <Image
        source={Images.background}
        style={styles.backgroundImage}
        resizeMode="stretch"
      />
      <GameEngine
        ref={gameEngine}
        style={styles.gameContainer}
        running={running}
        systems={[Physics]}
        entities={entities}
        onEvent={onEvent}>
        <StatusBar hidden={true} />
        <Text style={styles.score}>{score}</Text>
        {!running && (
          <TouchableOpacity style={styles.fullScreenButton} onPress={reset}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
            </View>
          </TouchableOpacity>
        )}
      </GameEngine>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT,
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gameOverText: {
    color: 'white',
    fontSize: 48,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  score: {
    color: 'white',
    fontSize: 72,
    position: 'absolute',
    top: 50,
    left: Constants.MAX_WIDTH / 2 - 24,
    textShadowColor: '#222222',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2,
  },
});

export default App;
