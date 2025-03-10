import Matter from 'matter-js';
import {Constants} from '../constants';
import {Pipe} from './Pipe';
import {PipeTop} from './PipeTop';
import {PipeBottom} from './PipeBottom';

let tick = 0;
let pose = 1;
let pipes = 0;

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generatePipes = () => {
  let topPipeHeight = randomBetween(100, Constants.MAX_HEIGHT / 2 - 100);
  let bottomPipeHeight =
    Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE - 50;

  let sizes = [topPipeHeight, bottomPipeHeight];

  if (Math.random() < 0.5) {
    sizes = sizes.reverse();
  }

  return sizes;
};

export const resetPipeCount = () => {
  pipes = 0;
};

export const addPipesAtLocation = (x, world, entities) => {
  let [pipe1Height, pipe2Height] = generatePipes();

  let pipeTopWidth = Constants.PIPE_WIDTH;
  let pipeTopHeight = (pipeTopWidth / 205) * 95; // original image is 205x95

  pipe1Height = pipe1Height - pipeTopHeight;

  let pipe1Top = Matter.Bodies.rectangle(
    x,
    pipe1Height + pipeTopHeight / 2,
    pipeTopWidth,
    pipeTopHeight,
    {isStatic: true},
  );

  let pipe1 = Matter.Bodies.rectangle(
    x,
    pipe1Height / 2,
    Constants.PIPE_WIDTH,
    pipe1Height,
    {isStatic: true},
  );

  pipe2Height = pipe2Height - pipeTopHeight;

  let pipe2Top = Matter.Bodies.rectangle(
    x,
    Constants.MAX_HEIGHT - pipe2Height - 50 - pipeTopHeight / 2,
    pipeTopWidth,
    pipeTopHeight,
    {isStatic: true},
  );

  let pipe2 = Matter.Bodies.rectangle(
    x,
    Constants.MAX_HEIGHT - pipe2Height / 2 - 50,
    Constants.PIPE_WIDTH,
    pipe2Height,
    {isStatic: true},
  );

  Matter.World.add(world, [pipe1, pipe1Top, pipe2, pipe2Top]);

  entities['pipe' + (pipes + 1)] = {
    body: pipe1,
    scored: false,
    renderer: Pipe,
  };

  entities['pipe' + (pipes + 1) + 'Top'] = {
    body: pipe1Top,
    scored: false,
    renderer: PipeBottom,
  };

  entities['pipe' + (pipes + 2)] = {
    body: pipe2,
    scored: false,
    renderer: Pipe,
  };

  entities['pipe' + (pipes + 2) + 'Top'] = {
    body: pipe2Top,
    scored: false,
    renderer: PipeTop,
  };

  pipes += 2;
};

const Physics = (entities, {touches, time, dispatch}) => {
  let engine = entities.physics.engine;
  let world = entities.physics.world;
  let pill = entities.pill.body;

  let hadTouches = false;
  touches
    .filter(t => t.type === 'press')
    .forEach(t => {
      if (!hadTouches) {
        if (world.gravity.y === 0.0) {
          // first press really
          world.gravity.y = 1.2;
          addPipesAtLocation(
            Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
            world,
            entities,
          );
          addPipesAtLocation(
            Constants.MAX_WIDTH * 3 - Constants.PIPE_WIDTH / 2,
            world,
            entities,
          );
        }
        hadTouches = true;
        //Matter.Body.applyForce( bird, bird.position, {x: 0.00, y: -0.05});
        Matter.Body.setVelocity(pill, {
          x: pill.velocity.x,
          y: -10,
        });
      }
    });

  // for (let i = 1; i <= 4; i++) {
  //   if (
  //     entities['pipe' + i].body.position.x <=
  //     -1 * (Constants.PIPE_WIDTH / 2)
  //   ) {
  //     Matter.Body.setPosition(entities['pipe' + i].body, {
  //       x: Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
  //       y: entities['pipe' + i].body.position.y,
  //     });
  //   } else {
  //     Matter.Body.translate(entities['pipe' + i].body, {x: -1, y: 0});
  //   }
  // }

  Object.keys(entities).forEach(key => {
    if (key.indexOf('pipe') === 0 && entities.hasOwnProperty(key)) {
      Matter.Body.translate(entities[key].body, {x: -2, y: 0});

      if (
        key.indexOf('Top') !== -1 &&
        parseInt(key.replace('pipe', '')) % 2 === 0
      ) {
        if (
          entities[key].body.position.x <= pill.position.x &&
          !entities[key].scored
        ) {
          entities[key].scored = true;
          dispatch({type: 'score'});
        }

        if (entities[key].body.position.x <= -1 * (Constants.PIPE_WIDTH / 2)) {
          let pipeIndex = parseInt(key.replace('pipe', ''));
          delete entities['pipe' + (pipeIndex - 1) + 'Top'];
          delete entities['pipe' + (pipeIndex - 1)];
          delete entities['pipe' + pipeIndex + 'Top'];
          delete entities['pipe' + pipeIndex];

          addPipesAtLocation(
            Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
            world,
            entities,
          );
        }
      }
    } else if (key.indexOf('floor') === 0) {
      if (entities[key].body.position.x <= (-1 * Constants.MAX_WIDTH) / 2) {
        Matter.Body.setPosition(entities[key].body, {
          x: Constants.MAX_WIDTH + Constants.MAX_WIDTH / 2,
          y: entities[key].body.position.y,
        });
      } else {
        Matter.Body.translate(entities[key].body, {x: -2, y: 0});
      }
    }
  });

  Matter.Engine.update(engine, time.delta);

  tick += 1;
  if (tick % 5 === 0) {
    pose = pose + 1;
    if (pose > 3) {
      pose = 1;
    }
    entities.pill.pose = pose;
  }

  return entities;
};

export default Physics;
