@unmanaged class GameObject {
  id: i32;
}

export const gameObject: GameObject = {
  id: 0
};

export function getId(): i32 {
  return gameObject.id;
}

export function setId(id: i32): void {
  gameObject.id = id;
}

// array map list