import LinkedList from "@shamblonaut/js-linked-list/linkedList.js";
import Node from "@shamblonaut/js-linked-list/node.js";

export default function createHashSet() {
  let hashset = [];
  let capacity = 16;
  let filled = 0;

  const LOAD_FACTOR = 0.75;

  const growSet = () => {
    const entriesArray = entries();

    capacity *= 2;
    filled = 0;
    clear();
    entriesArray.forEach((key) => {
      add(key);
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

  const add = (key) => {
    const index = hash(key) % capacity;
    if (hashset[index] === undefined) {
      hashset[index] = new LinkedList(new Node(key, null, null));
      filled++;
    } else if (hashset[index].head.value !== key) {
      let pointer = hashset[index].head;
      while (true) {
        if (pointer.value === key) return;
        if (pointer.next === null) {
          hashset[index].append(key);
          filled++;
          break;
        }
        pointer = pointer.next;
      }
    }

    if (filled / capacity >= LOAD_FACTOR) growSet();
  };

  const has = (key) => {
    const bucket = hashset[hash(key) % capacity];
    if (!bucket) return false;

    let bucketHead = hashset[hash(key) % capacity].head;
    if (bucketHead.value === key) return true;
    while (bucketHead.next !== null) {
      bucketHead = bucketHead.next;
      if (bucketHead.value === key) return true;
    }
    return false;
  };

  const remove = (key) => {
    if (!has(key)) return false;

    const index = hash(key) % capacity;
    const bucket = hashset[index];
    let bucketHead = bucket.head;

    let i = 0;
    let removed = false;
    if (bucketHead.value === key) {
      bucket.removeAt(i);
      removed = true;
      filled--;
    }
    while (bucketHead.next !== null) {
      i++;
      bucketHead = bucketHead.next;
      if (bucketHead.value === key) {
        bucket.removeAt(i);
        removed = true;
        filled--;
      }
    }

    if (bucket.head === null) hashset[index] = undefined;
    return removed;
  };

  const length = () => filled;

  const clear = () => {
    hashset = [];
  };

  const entries = () => {
    const entriesArray = [];
    for (let i = 0; i < capacity; i++) {
      if (!hashset[i]) continue;

      let bucketHead = hashset[i].head;

      entriesArray.push(bucketHead.value);
      while (bucketHead.next !== null) {
        bucketHead = bucketHead.next;
        entriesArray.push(bucketHead.value);
      }
    }
    return entriesArray;
  };

  // const print = () => {
  //   console.log(`--- DEBUG START --- Capacity: ${capacity} ---`);
  //   for (let i = 0; i < capacity; i++) {
  //     if (hashset[i]) console.log(`${i}: ${hashset[i].toString()}`);
  //   }
  //   console.log(`--- DEBUG END ---`);
  // };

  return {
    hash,
    add,
    has,
    remove,
    length,
    clear,
    entries,
  };
}
