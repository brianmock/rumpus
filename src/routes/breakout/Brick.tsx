import { LEVELS } from './';

export type BrickType = 'easy' | 'medium' | 'hard';
export type Brick = { x: number, y: number, status: number, type: BrickType };

export const BRICK_TYPES: Record<BrickType, { columns: number, height: number, width: number, color: string, points: number }> = {
  easy: { columns: 7, height: 20, width: 75, color: '#90AA86', points: 1 },
  medium: { columns: 7, height: 15, width: 60, color: '#F7DBA7', points: 2 },
  hard: { columns: 9, height: 10, width: 45, color: '#C57B57', points: 3 },
};

const brickPadding = 15;
const brickHorizontalPadding = 30;

export function drawBrick(row: number, column: number, ctx: CanvasRenderingContext2D, brick: Brick, offsetTop: number, offsetLeft: number) {
  const {width, color, height} = BRICK_TYPES[brick.type];
  const brickX = (column*(width+brickHorizontalPadding))+offsetLeft;
  const brickY = offsetTop;
  brick.x = brickX;
  brick.y = brickY;
  ctx.beginPath();
  ctx.rect(brickX, brickY, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

export function drawBricks(ctx: CanvasRenderingContext2D, bricks: Brick[][]) {
  let offsetTop = 30;
  bricks.forEach((row, rowIndex) => {
    offsetTop += (BRICK_TYPES[bricks[rowIndex][0].type].height + brickPadding)
    const rowWidth = row.length * (BRICK_TYPES[row[0].type].width + brickHorizontalPadding);
    const canvasWidth = ctx.canvas.width;
    const offsetLeft = (canvasWidth - rowWidth) / 2;
    row.forEach((brick, colIndex) => {
      if(brick.status === 1) {
        drawBrick(rowIndex, colIndex, ctx, brick, offsetTop, offsetLeft);
      }
    })
  });
}

export function createBricks(level: number) {
  const bricks: { easy: Brick[][], medium: Brick[][], hard: Brick[][] } = {
    easy: [],
    medium: [],
    hard: [],
  };
  const brickTypes: BrickType[] = ['easy', 'medium', 'hard'];

  brickTypes.forEach((brickType) => {
    if (!LEVELS[level][brickType]) return;
    for(let r=0; r<LEVELS[level][brickType]; r++) {
      bricks[brickType][r] = [];
      for(let c=0; c < BRICK_TYPES[brickType].columns; c++) {
        bricks[brickType][r][c] = { x: 0, y: 0, status: 1, type: brickType };
      }
    }
  });

  return [...bricks.hard, ...bricks.medium, ...bricks.easy];
}

export function isInBrick({ brick, x, y }: { brick: Brick, x: number, y: number }) {
  return x > brick.x && x < brick.x + BRICK_TYPES[brick.type].width && y > brick.y && y < brick.y + BRICK_TYPES[brick.type].height;
}
