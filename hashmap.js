import LinkedList from "@shamblonaut/js-linked-list/linkedList.js";
import Node from "@shamblonaut/js-linked-list/node.js";

export function createHashMap(initialCapacity = 16) {
  let map = [];
  let capacity = initialCapacity;
  let filled = 0;

  const LOAD_FACTOR = 0.75;

  const growMap = () => {
    const entriesArray = entries();

    capacity *= 2;
    clear();
    filled = 0;
    entriesArray.forEach(([key, value]) => {
      set(key, value);
    });
  };

  const hash = (key) => {
    const primeNumber = 31;

    let hashCode = 0;
    for (let i = 0; i < key.length; i++) {
      hashCode = hashCode * primeNumber + key.charCodeAt(i);
    }
    return hashCode;
  };

  const set = (key, value) => {
    const index = hash(key) % capacity;
    if (map[index] === undefined) {
      map[index] = new LinkedList(new Node({ key, value }, null, null));
      filled++;
    } else if (map[index].head.value.key === key) {
      map[index].head.value.value = value;
    } else {
      let pointer = map[index].head;
      while (true) {
        if (pointer.value.key === key) {
          pointer.value.value = value;
          break;
        } else if (pointer.next === null) {
          map[index].append({ key, value });
          filled++;
          break;
        }
        pointer = pointer.next;
      }
    }

    if (filled / capacity >= LOAD_FACTOR) growMap();
  };

  const get = (key) => {
    let bucketHead = map[hash(key) % capacity].head;
    if (!bucketHead) return null;

    if (bucketHead.value.key === key) return bucketHead.value.value;
    while (bucketHead.next !== null) {
      bucketHead = bucketHead.next;
      if (bucketHead.value.key === key) return bucketHead.value.value;
    }
    return null;
  };

  const has = (key) => {
    return get(key) !== null;
  };

  const remove = (key) => {
    if (!get(key)) return false;

    const index = hash(key) % capacity;
    const bucket = map[index];
    let bucketHead = bucket.head;

    let i = 0;
    let removed = false;
    if (bucketHead.value.key === key) {
      bucket.removeAt(i);
      removed = true;
      filled--;
    }
    while (bucketHead.next !== null) {
      i++;
      bucketHead = bucketHead.next;
      if (bucketHead.value.key === key) {
        bucket.removeAt(i);
        removed = true;
        filled--;
      }
    }

    if (bucket.head === null) map[index] = undefined;
    return removed;
  };

  const length = () => filled;

  const clear = () => {
    map = [];
  };

  const keys = () => {
    const keysArray = [];
    for (let i = 0; i < capacity; i++) {
      if (!map[i]) continue;

      let bucketHead = map[i].head;

      keysArray.push(bucketHead.value.key);
      while (bucketHead.next !== null) {
        bucketHead = bucketHead.next;
        keysArray.push(bucketHead.value.key);
      }
    }
    return keysArray;
  };

  const values = () => {
    const valuesArray = [];
    const keysArray = keys();
    for (let i = 0; i < keysArray.length; i++) {
      const value = get(keysArray[i]);
      if (value !== null) valuesArray.push(value);
    }
    return valuesArray;
  };

  const entries = () => {
    const entriesArray = [];
    const keysArray = keys();
    for (let i = 0; i < keysArray.length; i++) {
      entriesArray.push([keysArray[i], get(keysArray[i])]);
    }
    return entriesArray;
  };

  const print = () => {
    console.log(`--- DEBUG START --- Capacity: ${capacity} ---`);
    for (let i = 0; i < capacity; i++) {
      if (!map[i]) continue;

      let pointer = map[i].head;
      let string = "";
      while (true) {
        if (pointer)
          string += `( ${pointer.value.key}: ${pointer.value.value} ) -> `;

        if (pointer.next === null) break;
        else pointer = pointer.next;
      }
      string += "null";

      console.log(`${i}: ${string}`);
    }
    console.log(`--- DEBUG END ---`);
  };

  return {
    hash,
    set,
    get,
    has,
    remove,
    length,
    clear,
    keys,
    values,
    entries,
    print,
    growMap,
    capacity,
  };
}
