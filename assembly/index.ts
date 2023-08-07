import { List, Entity } from "./engine";

@unmanaged class Player extends Entity {
    public direction: i32 = 1;
    constructor(x: u32, y: u32, color: u32) {
        super(x, y, color);
    }
    move(): void {
        const color = this.color;
        this.color = 0x00000000;
        this.draw();
        this.color = color;
        if (this.x > 18 || this.x < 1) this.direction *= -1;
        this.x += this.direction;
        this.draw();
    }
}

const player = new Player(5, 5, 0xff0000dd);

const gameScene: List<Entity> | null = List
    .add(new Entity(0, 0, 0xff000000))
    .add(new Entity(1, 1, 0xffdddd00))
    .add(new Entity(0, 3, 0xffff00ff))
    .add(new Entity(19, 3, 0xffff00ff))
    .add(player)
;

{
    let current: List<Entity> | null = gameScene;
    while (current != null) {
        current.el.draw();
        current = current.next;
    }
}

export function u(t: i32): void {
    player.move();
}

export function c(x: i32, y: i32, s: bool): void { }
