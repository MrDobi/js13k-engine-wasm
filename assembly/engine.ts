const WIDTH = 20;
const HEIGHT = 20;

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

@unmanaged export class Entity {
    constructor(public x: u32, public y: u32, public color: u32) { }
    draw(): void {
        store<u32>((this.x + this.y * WIDTH) * 4, this.color);
    }
}