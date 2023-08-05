// @ts-nocheck
@inline const AL_BITS: u32 = 4; // 16 bytes to fit up to v128
@inline const AL_SIZE: usize = 1 << <usize>AL_BITS;
@inline const AL_MASK: usize = AL_SIZE - 1;

@unmanaged class BLOCK {
    mmInfo: usize;
}

@unmanaged class OBJECT extends BLOCK {
    /** Garbage collector info. */
    gcInfo: u32;
    /** Garbage collector info. */
    gcInfo2: u32;
    /** Runtime class id. */
    rtId: u32;
    /** Runtime object size. */
    rtSize: u32;
}

@inline const BLOCK_OVERHEAD: usize = offsetof<BLOCK>();
@inline const BLOCK_MAXSIZE: usize = (1 << 30) - BLOCK_OVERHEAD;
@inline const OBJECT_OVERHEAD: usize = (offsetof<OBJECT>() - BLOCK_OVERHEAD + AL_MASK) & ~AL_MASK;
@inline const OBJECT_MAXSIZE: usize = BLOCK_MAXSIZE - OBJECT_OVERHEAD;

@lazy @inline
const E_ALLOCATION_TOO_LARGE: string = "Allocation too large";

@lazy let startOffset: usize = ((__heap_base + BLOCK_OVERHEAD + AL_MASK) & ~AL_MASK) - BLOCK_OVERHEAD;
@lazy let offset: usize = startOffset;

function maybeGrowMemory(newOffset: usize): void {
  // assumes newOffset is aligned
  let pagesBefore = memory.size();
  let maxOffset = ((<usize>pagesBefore << 16) + AL_MASK) & ~AL_MASK;
  if (newOffset > maxOffset) {
    let pagesNeeded = <i32>(((newOffset - maxOffset + 0xffff) & ~0xffff) >>> 16);
    let pagesWanted = max(pagesBefore, pagesNeeded); // double memory
    if (memory.grow(pagesWanted) < 0) {
      if (memory.grow(pagesNeeded) < 0) unreachable(); // out of memory
    }
  }
  offset = newOffset;
}

@inline function computeSize(size: usize): usize {
  return ((size + BLOCK_OVERHEAD + AL_MASK) & ~AL_MASK) - BLOCK_OVERHEAD;
}

@unsafe @global
function __alloc(size: usize): usize {
  if (size > BLOCK_MAXSIZE) throw new Error(E_ALLOCATION_TOO_LARGE);
  let block = changetype<BLOCK>(offset);
  let ptr = offset + BLOCK_OVERHEAD;
  let payloadSize = computeSize(size);
  maybeGrowMemory(ptr + payloadSize);
  block.mmInfo = payloadSize;
  return ptr;
}

@unsafe @global
function __realloc(ptr: usize, size: usize): usize {
  assert(ptr != 0 && !(ptr & AL_MASK)); // must exist and be aligned
  let block = changetype<BLOCK>(ptr - BLOCK_OVERHEAD);
  let actualSize = block.mmInfo;
  let isLast = ptr + actualSize == offset;
  let payloadSize = computeSize(size);
  if (size > actualSize) {
    if (isLast) { // last block: grow
      if (size > BLOCK_MAXSIZE) throw new Error(E_ALLOCATION_TOO_LARGE);
      maybeGrowMemory(ptr + payloadSize);
      block.mmInfo = payloadSize;
    } else { // copy to new block at least double the size
      let newPtr = __alloc(max<usize>(payloadSize, actualSize << 1));
      memory.copy(newPtr, ptr, actualSize);
      block = changetype<BLOCK>((ptr = newPtr) - BLOCK_OVERHEAD);
    }
  } else if (isLast) { // last block: shrink
    offset = ptr + payloadSize;
    block.mmInfo = payloadSize;
  }
  return ptr;
}

@unsafe @global
function __free(ptr: usize): void {
  assert(ptr != 0 && !(ptr & AL_MASK)); // must exist and be aligned
  let block = changetype<BLOCK>(ptr - BLOCK_OVERHEAD);
  if (ptr + block.mmInfo == offset) { // last block: discard
    offset = changetype<usize>(block);
  }
}

@unsafe @global
function __reset(): void { // special
  offset = startOffset;
}

@unsafe @global
function __new(size: usize, id: u32): usize {
  if (size > OBJECT_MAXSIZE) throw new Error(E_ALLOCATION_TOO_LARGE);
  let ptr = __alloc(OBJECT_OVERHEAD + size);
  let object = changetype<OBJECT>(ptr - BLOCK_OVERHEAD);
  object.gcInfo = 0;
  object.gcInfo2 = 0;
  object.rtId = id;
  object.rtSize = <u32>size;
  return ptr + OBJECT_OVERHEAD;
}

@unsafe @global
function __renew(oldPtr: usize, size: usize): usize {
  if (size > OBJECT_MAXSIZE) throw new Error(E_ALLOCATION_TOO_LARGE);
  let newPtr = __realloc(oldPtr - OBJECT_OVERHEAD, OBJECT_OVERHEAD + size);
  changetype<OBJECT>(newPtr - BLOCK_OVERHEAD).rtSize = <u32>size;
  return newPtr + OBJECT_OVERHEAD;
}

@global @unsafe
function __link(parentPtr: usize, childPtr: usize, expectMultiple: bool): void {
  // nop
}

@global @unsafe
function __pin(ptr: usize): usize {
  return ptr;
}

@global @unsafe
function __unpin(ptr: usize): void {
  // nop
}

@global @unsafe
function __visit(ptr: usize, cookie: u32): void { // eslint-disable-line @typescript-eslint/no-unused-vars
  // nop
}

@global @unsafe
function __collect(): void {
  // nop
}