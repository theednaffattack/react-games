import { GameAction, GameState } from "./components/game-reducer";
import { GridSquare } from "./create-dungeon";
import { Weapon } from "./create-entities";
import { Coords } from "./game-action";
import { potionRegistry as pr } from "./potion-registry";
import { GameActionEnum as GA } from "./types";
import type { GameActionEnum } from "./types";

interface PlayerInputProps {
  dispatch: React.Dispatch<GameAction>;
  state: GameState;
  vector: Coords;
}

export function playerInput({ dispatch, state, vector }: PlayerInputProps) {
  const [x, y] = state.playerPosition; // get current location
  const [vectorX, vectorY] = vector; // get direction modifier

  const newPosition: Coords = [vectorX + x, vectorY + y]; // define where we're moving to

  const newPlayer = state.entities[y][x];
  const destination = state.entities[y + vectorY][x + vectorX]; // whats in the cell we're heading to

  if (destination.type === "exit") {
    dispatch({
      type: GA.CREATE_LEVEL,
    });
  }

  if (destination.type === "weapon") {
    const { cost, damage, name, type } = destination as Weapon;
    dispatch({
      type: GA.PICKUP_ITEM,
      payload: { cost, damage, name, type },
    });
  }

  if (destination.type === "potion") {
    const {
      elixir: { cost, health, name, type },
    } = pr;

    dispatch({
      type: GA.PICKUP_ITEM,
      payload: { cost, health, name, type },
    });
  }

  if (
    destination.type &&
    destination.type !== "enemy" &&
    destination.type !== "exit" &&
    destination.type !== "boss"
  ) {
    dispatch({
      type: GA.CHANGE_ENTITY,
      payload: { entity: { type: "floor" }, coords: [x, y] },
    });

    dispatch({
      type: GA.CHANGE_ENTITY,
      payload: { entity: newPlayer, coords: newPosition },
    });

    dispatch({
      type: GA.CHANGE_PLAYER_POSITION,
      payload: newPosition,
    });
  }
}