import { Entity, List, draw, C_TRANSPARENT, WIDTH, random } from "./engine";

const SNAKE: u32 = 0xff222222;
@unmanaged export class Snake extends Entity {
    public directionX: i32 = 0;
    public directionY: i32 = 0;
    public speed: i32 = 200;
    public tail: List<Entity> = new List(this);

    constructor(x: u32, y: u32) { super(x, y, SNAKE); }
    move(apple: Apple): void {
        const tail = this.tail.el;
        draw(tail.x, tail.y, C_TRANSPARENT);

        let current: List<Entity> | null = this.tail;
        if (current) do {
            const next = current.next;
            if (next) {
                current.el.x = next.el.x;
                current.el.y = next.el.y;
            }

            if (this.x + this.directionX == current.el.x && this.y + this.directionY == current.el.y) {
                const last: List<Entity> = current;
                let currentTail: List<Entity> | null = this.tail;
                if (currentTail) do {
                    draw(currentTail.el.x, currentTail.el.y, 0xff333333);
                    if (currentTail == last) {
                        this.tail = last;
                        break;
                    }
                } while (currentTail = currentTail.next);
            }
        } while (current = current.next);

        this.x += this.directionX;
        if (this.x < 0) this.x = WIDTH - 1;
        else if (this.x >= WIDTH) this.x = 0;

        this.y += this.directionY;
        if (this.y < 0) this.y = WIDTH - 1;
        else if (this.y >= WIDTH) this.y = 0;

        this.draw();

        if (this.x == apple.x && this.y == apple.y) {
            const newTail = new Entity(tail.x, tail.y, this.sprite);
            newTail.draw();
            this.tail.add(newTail);
            apple.update(this);
            this.speed--;
        }
    }
}

const APPLE = 0xff0000dd;
@unmanaged export class Apple extends Entity {
    constructor() { super(random() % WIDTH, random() % WIDTH, APPLE); }
    update(snake: Snake): void {
        this.x = random() % WIDTH;
        this.y = random() % WIDTH;
        this.draw();

        let current: List<Entity> | null = snake.tail;
        if (current) do if (current.el.x == this.x && current.el.y == this.y) {
            draw(this.x, this.y, C_TRANSPARENT);
            return this.update(snake);
        } while (current = current.next);
    }
}