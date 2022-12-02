function Bot(object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)), difficulty = 10, callback = function(type, func) {}, collisionList = []) {
  function collision(e, B) {
    let firstBB = new THREE.Box3().setFromObject(e);
    let secondBB = new THREE.Box3().setFromObject(B);
    return firstBB.intersectsBox(secondBB);
  }
  return { object: object, runner: setInterval(() => {
    collisionList.forEach(x => {
      if (collision(x, object)) {
        let r0 = object.clone();
        r.rotateY(.5);
        let r1 = object.clone();
        r.rotateY(-.5);
        let r2 = object.clone();
        r.rotateY(1);
        let r3 = object.clone();
        r.rotateY(-1);
        if (collision(r0, x)) {
          object.rotateY(.5);
        }
        if (collision(r1, x)) {
          object.rotateY(-.5);
        }
        if (collision(r2, x)) {
          object.rotateY(1);
        }
        if (collision(r3, x)) {
          object.rotateY(-1);
        }
      }
    });
    if (object.position.distanceTo(camera.position) <= 15) {
      if (Math.floor(Math.random() * (difficulty * 2)) == 0) {
        for (let i = 0; i < object.position.distanceTo(camera.position) / 20 * Math.floor(Math.random() * 2); i++) {
          callback("attack", Math.floor(Math.random() * 5) + difficulty);
        }
      }
    }
    if (object.position.distanceTo(camera.position) <= 10) {
      setTimeout(() => object.lookAt(camera.position), 250);
    }
    if (Math.floor(Math.random() * 10) == 0) {
      object.translateZ(Math.floor(Math.random() * 3) == 0 ? -(Math.floor(Math.random() * 2) / (difficulty <= 5 ? 10 : difficulty <= 10 ? 5 : 3)) : (Math.floor(Math.random() * 2) / (difficulty <= 5 ? 10 : difficulty <= 10 ? 5 : 3)));
      Math.floor(Math.random() * 25) == 0 && object.translateX(Math.floor(Math.random() * 2) == 0 ? -(Math.floor(Math.random() * 2) / 15) : Math.floor(Math.random()*  2) / 20);
    }
  }) }
}