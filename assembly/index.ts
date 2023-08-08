
import { random } from "./engine";
import { Apple, Snake } from "./snake";

// snake + cursor to add apples + sprites (html + css + js + wasm in 1kb packed)
// camera - screen shake?

const snake = new Snake(10, 10);
const apple = new Apple();

snake.draw();

let time: u64 = 0,  moved = true;
export function u(t: i32): void {
    do if (++time % snake.speed == 0) {
        snake.move(apple);
        moved = true;
    } while (--t >= 0);
}

export function c(x: i32, y: i32, s: bool): void {
    if ((x || y) && s && moved) {
        if (snake.directionX == 0 && snake.directionY == 0) {
            random(<i32>time);
            apple.update(snake);
        }
    
        if (x && snake.directionX == 0) {
            snake.directionX = x;
            snake.directionY = 0;
        } else if (y && snake.directionY == 0) {
            snake.directionX = 0;
            snake.directionY = y;
        }

        moved = false;
    }
}
