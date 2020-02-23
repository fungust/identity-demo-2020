class Logger {
  constructor(name) {
    this.name = name;
    this.surpress = false;
  }

  disable() {
    this.surpress = true;
  }

  enable() {
    this.surpress = false;
  }

  status(module, content) {
    if (this.surpress) { return }
    let msg = `${(new Date()).toISOString()} - ${this.name}::${module}: ${content}`;
    console.log(msg);
  }

  info(module, content) {
    if (this.surpress) { return }
    let msg = `${(new Date()).toISOString()} - ${this.name}::${module}: ${content}`;
    console.log(msg);
  }

  success(module, content) {
    if (this.surpress) { return }
    let msg = `${(new Date()).toISOString()} - ${this.name}::${module}: ${content}`;
    console.log(msg);
  }

  warn(module, content) {
    if (this.surpress) { return }
    let msg = `${(new Date()).toISOString()} - ${this.name}::${module}: ${content}`;
    console.log(msg);
  }

  error(module, content) {
    let msg = `${(new Date()).toISOString()} - ${this.name}::${module}: ${content}\u0007`;
    console.log(msg);
  }
}

module.exports.logger = Logger;