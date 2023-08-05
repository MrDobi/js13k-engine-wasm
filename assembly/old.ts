// Od nowa :D

// class List<T> {
//   constructor(public object: T, public next: List<T> | null = null) {}
// }

// class GameObject1 {
//   constructor(public id: i32) {}
// }

// class GameObject2 {
//   id: i32;
// }

// // const s = new GameObject1(0)
// const s: GameObject2 = {
//   id: 0,
// };

// export const s2 = new GameScene(new List(new GameObject(0)))

// type A = { id: i32 };



// Dzień dobry tutaj powstanie nasza gra, żeby gra była grą potrzebujemy ogarnąć kilka konceptów
// runtime:
// 1. show square
// 2. input
// 3. game loop
// engine:
// 1. scene?
// 2. react-like?
// this is 1kb of all
// gameplay:
// first demo jumping square - angry birds
// second demo, more to rts? pharaoh, knights and merchants?
// to ma być gra na konkurs więc kilka konceptów więcej
// size
// sound
// other categories?

// memory.grow(1);

// flappy birds, just static, then

// function rgb(red: i32, green: i32, blue: i32): u32 {
//   return (255 << 24) + (blue << 16) + (green << 8) + red;
// }

// HERE

// const WIDTH = 16;
// const HEIGHT = 9;

// // const BIRD_COLOR = rgb(255, 120, 120);
// const BIRD_COLOR = (255 << 24) + (120 << 16) + (120 << 8) + 255;
// let BIRD_POS = 4 * WIDTH + 2;

// const WALL_X = 10;
// // const WALL_COLOR = rgb(120, 120, 120);
// const WALL_COLOR = (255 << 24) + (120 << 16) + (120 << 8) + 120;

// // draw
// export function d(): void {
//   // bird
//   drawPixelColor(BIRD_POS, BIRD_COLOR)

//   // wall
//   for (let index = 0; index < HEIGHT; index++) {
//     if (index != 4 && index != 5 && index != 6)
//       drawPixelColor(index * WIDTH + WALL_X, WALL_COLOR)
//   }
// }

// // update
// export function u(): void {
//   drawPixelColor(BIRD_POS, 0)
//   BIRD_POS += WIDTH;
// }

// // input
// export function c(input: i32): void {
//   drawPixelColor(BIRD_POS, 0)
//   BIRD_POS -= WIDTH * 4;
// }

// export const BUFFER_POINTER: i32 = 0;
// export const BUFFER_SIZE: i32 = WIDTH * HEIGHT * 4;

// export function drawPixel(index: i32, red: i32, green: i32, blue: i32): void {
//   store<u32>(BUFFER_POINTER + index * 4, (255 << 24) + (blue << 16) + (green << 8) + red);
// }

// export function drawPixelColor(index: i32, color: u32): void {
//   store<u32>(BUFFER_POINTER + index * 4, color);
// }