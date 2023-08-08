let seed: i32 = 0;
export function random(s: i32 = 0): i32 {
    if (s) seed = s;

    return seed += seed % 128;
}

export const WIDTH = 20;
export const HEIGHT = 20;

@unmanaged export class List<T> {
    constructor(public el: T, public next: List<T> | null = null) { }

    static add<T>(el: T): List<T> {
        return new List<T>(el);
    }

    add(el: T): List<T> {
        this.next = new List<T>(this.el, this.next);
        this.el = el;
        return this;
    }
}


export const C_TRANSPARENT = 0x00000000;

export const C_00 = 0xff000000;
export const C_01 = 0xff000000;
export const C_02 = 0xff000000;
export const C_03 = 0xff000000;
export const C_04 = 0xff000000;
export const C_05 = 0xff000000;
export const C_06 = 0xff000000;
export const C_07 = 0xff000000;
export const C_08 = 0xff000000;
export const C_09 = 0xff000000;
export const C_10 = 0xff000000;
export const C_11 = 0xff000000;
export const C_12 = 0xff000000;
export const C_13 = 0xff000000;
export const C_14 = 0xffffffff;
export const C_15 = C_TRANSPARENT;

export function draw(x: i32, y: i32, sprite: u32): void {
    const color: u32 = sprite;
    // TODO sprites
    store<u32>((x + y * WIDTH) * 4, color);
}

@unmanaged export class Entity {
    constructor(public x: i32, public y: i32, public sprite: u32) { }
    draw(): void { draw(this.x, this.y, this.sprite); }
}