export default class Observer {
  constructor(id, subject) {
    this.id = id;
    this.subject = subject;
  }
  on(label, callback) {
    this.subject.addListener(label, callback);
  }
}
