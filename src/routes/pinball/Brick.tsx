import { LEVELS } from './';

export type BrickType = 'easy' | 'medium' | 'hard';
export type Brick = { x: number, y: number, status: number, type: BrickType };

export const BRICK_TYPES: Record<BrickType, { columns: number, height: number, width: number, color: string, points: number }> = {
  easy: { columns: 5, height: 20, width: 75, color: 'green', points: 1 },
  medium: { columns: 7, height: 15, width: 60, color: 'orange', points: 2 },
  hard: { columns: 9, height: 10, width: 45, color: 'red', points: 3 },
};

const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;


export function drawBrick(row: number, column: number, ctx: CanvasRenderingContext2D, brick: Brick, ) {
  const {width, color, height} = BRICK_TYPES[brick.type];
  const brickX = (row*(width+brickPadding))+brickOffsetLeft;
  const brickY = (column*(height+brickPadding))+brickOffsetTop;
  brick.x = brickX;
  brick.y = brickY;
  ctx.beginPath();
  ctx.rect(brickX, brickY, width, height);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

export function drawBricks(ctx: CanvasRenderingContext2D, bricks: Brick[][]) {
  bricks.forEach((row, rowIndex) => row.forEach((brick, colIndex) => {
    if(brick.status === 1) {
      drawBrick(rowIndex, colIndex, ctx, brick);
    }
  }));
}

export function createBricks(level: number) {
  const bricks: Brick[][] = [];
  const brickTypes: BrickType[] = ['easy', 'medium', 'hard'];

  brickTypes.forEach((brickType, index) => {
    if (!LEVELS[level][brickType]) return;
    for(let c=0; c < BRICK_TYPES[brickType].columns + index; c++) {
      bricks[c] = [];
      for(let r=0; r<LEVELS[level][brickType] + index; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, type: brickType };
      }
    }
  });

  return bricks;
}
