import Matter from 'matter-js';
import {Constants} from '../constants';

let tick = 0;
let pose = 1;

const Physics = (entities, {touches, time}) => {
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
    if (key.indexOf('floor') === 0) {
      if (entities[key].body.position.x <= -1 * (Constants.MAX_WIDTH / 2)) {
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
